export const PAGE_SIZE = 20;

export async function fetchPage({ q, filters, page }) {
  const params = new URLSearchParams({
    q,
    limit: String(PAGE_SIZE),
    offset: String((page - 1) * PAGE_SIZE),
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== "")
    ),
  });

  const res = await fetch(`http://localhost:8080/api/search?${params.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return { ...data, fromCache: false, page, pageSize: PAGE_SIZE };
}
