import { useEffect, useMemo, useRef, useState } from "react";
import { PAGE_SIZE, getOffset, buildCacheKey } from "../utils/searchPagination";

// Simple in-memory cache: { key: { results, total } }
const searchCache = new Map();

export function useSearchWithCache({ q, page, filters }) {
  const [data, setData] = useState({
    results: [],
    total: 0,
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const pageNumber = Number(page) || 1;

  const cacheKey = useMemo(
    () => buildCacheKey({ q, page: pageNumber, filters }),
    [q, pageNumber, filters]
  );

  const abortRef = useRef(null);

  useEffect(() => {
    if (!q) {
      setData({ results: [], total: 0 });
      setStatus("idle");
      setError(null);
      return;
    }

    // Check cache first
    const cached = searchCache.get(cacheKey);
    if (cached) {
      setData(cached);
      setStatus("success");
      setError(null);
      return;
    }

    // Not in cache: fetch
    const fetchData = async () => {
      setStatus("loading");
      setError(null);

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const offset = getOffset(pageNumber, PAGE_SIZE);

      const params = new URLSearchParams({
        q,
        limit: String(PAGE_SIZE),
        offset: String(offset),
        // add filters if present
        ...(filters.genre ? { genre: filters.genre } : {}),
        ...(filters.year ? { year: String(filters.year) } : {}),
        ...(filters.rating ? { rating: String(filters.rating) } : {}),
      });

      try {
        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const json = await res.json();
        // Expecting { results: [], total: number }
        const payload = {
          results: json.results || [],
          total: json.total || 0,
        };

        searchCache.set(cacheKey, payload);
        setData(payload);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
        setError(err);
      }
    };

    fetchData();
  }, [q, pageNumber, filters, cacheKey]);

  const pageCount = useMemo(() => {
    if (!data.total) return 0;
    return Math.ceil(data.total / PAGE_SIZE);
  }, [data.total]);

  return {
    ...data, // results, total
    status,
    error,
    page: pageNumber,
    pageCount,
    pageSize: PAGE_SIZE,
  };
}
