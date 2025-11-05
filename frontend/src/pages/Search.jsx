import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom"; //
import ShowCard from "../components/ShowCard";

const GENRES = ["ACTION","COMEDY","DRAMA","FANTASY","HORROR","ROMANCE","SCIFI","THRILLER","ANIMATION"];

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE || 20);

function getOffset(page, pageSize = PAGE_SIZE) {
  return Math.max(0, (page - 1) * pageSize);
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const q = searchParams.get("q") || searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const username = searchParams.get("username") || "";
  const inPublicPlaylists = searchParams.get("inPublicPlaylists") || "true";
  const page = Number(searchParams.get("page") || "1");

  // data state
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // update URL params (and reset page when filter changes)
  function updateParam(name, value) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value === "" || value == null) p.delete(name);
      else p.set(name, value);
      if (name !== "page") p.set("page", "1");
      return p;
    }, { replace: false });
  }

  function goToPage(next) {
    if (next < 1) return;
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(next));
      return p;
    }, { replace: false });
  }

  // fetch from backend /api/search
  useEffect(() => {
    const controller = new AbortController();
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const params = new URLSearchParams({
          q,
          limit: String(PAGE_SIZE),
          offset: String(getOffset(page)),
        });
        if (genre) params.set("genre", genre);
        if (year) params.set("year", year);
        if (username) params.set("username", username);
        if (inPublicPlaylists) params.set("inPublicPlaylists", inPublicPlaylists);

        const res = await fetch(`${API_BASE}/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        const data = await res.json(); // { items: [], total: number }
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(Number(data.total || 0));
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setErr(e.message || "Failed to load results");
        }
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => controller.abort();
  }, [q, genre, year, username, inPublicPlaylists, page]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startN = total === 0 ? 0 : getOffset(page) + 1;
  const endN = Math.min(total, getOffset(page) + PAGE_SIZE);

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Search</h1>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Search by title…"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
          />

          <select
            className="border rounded px-3 py-2 text-black"
            value={genre}
            onChange={(e) => updateParam("genre", e.target.value)}
          >
            <option value="">Genre (any)</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            className="border rounded px-3 py-2 text-black"
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => updateParam("year", e.target.value)}
          />

          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Username (playlist owner)"
            value={username}
            onChange={(e) => updateParam("username", e.target.value)}
          />

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={inPublicPlaylists === "true"}
              onChange={(e) =>
                updateParam("inPublicPlaylists", e.target.checked ? "true" : "")
              }
            />
            <span>Public Playlists</span>
          </label>
        </div>

        {/* Status */}
        {loading && <div className="animate-pulse text-gray-200">Loading results…</div>}
        {err && <div className="text-red-300">Error: {err}</div>}

        {/* Result summary */}
        {!loading && !err && (
          <div className="text-sm text-gray-200">
            Showing {startN}–{endN} of {total} • Page {page} / {pageCount}
          </div>
        )}

        {/* Results */}
        {!loading && !err && (
          items.length === 0 ? (
            <div className="text-gray-200">No results. Try adjusting filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((show) => (
                <ShowCard key={show.id || show.tmdbId || `${show.title}-${show.year}`} show={show} />
              ))}
            </div>
          )
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-white/10"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              aria-label="Previous page"
            >
              Prev
            </button>

            {Array.from({ length: Math.min(pageCount, 7) }).map((_, i) => {
              const p = i + Math.max(1, Math.min(page - 3, pageCount - 6));
              return (
                <button
                  key={p}
                  className={`border px-3 py-1 rounded ${
                    p === page ? "bg-white text-black font-semibold" : "hover:bg-white/10"
                  }`}
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              );
            })}

            <button
              className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-white/10"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}