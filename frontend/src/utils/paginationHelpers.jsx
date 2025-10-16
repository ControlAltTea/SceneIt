// page is 1-based
export const PAGE_SIZE = 20;

export function getOffset(page, pageSize = PAGE_SIZE) {
  return Math.max(0, (page - 1) * pageSize);
}

export function buildCacheKey(q, filters, page) {
  return JSON.stringify({ q: (q || "").trim(), filters, page });
}

// simple in-memory cache
const cache = new Map(); // key -> { items, total, page, pageSize, pageCount, ts }

export async function fetchPage({ q = "", filters = {}, page = 1 }) {
  const key = buildCacheKey(q, filters, page);
  if (cache.has(key)) return { ...cache.get(key), fromCache: true };

  const params = new URLSearchParams({
    q,
    limit: String(PAGE_SIZE),
    offset: String(getOffset(page)),
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v != null)
    ),
  });

  const res = await fetch(`/api/search?${params.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json(); // expects { items, total, page?, pageSize?, pageCount? }

  const normalized = {
    items: data.items || [],
    total: Number(data.total || 0),
    page: Number(data.page || page),
    pageSize: Number(data.pageSize || PAGE_SIZE),
    pageCount:
      Number(data.pageCount) ||
      Math.max(1, Math.ceil((data.total || 0) / (data.pageSize || PAGE_SIZE))),
  };

  cache.set(key, { ...normalized, ts: Date.now() });
  return { ...normalized, fromCache: false };
}