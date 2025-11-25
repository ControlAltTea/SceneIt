export const PAGE_SIZE = 20;

/**
 * Given a 1-based page number and page size, return the offset
 * used by the API (0-based).
 */
export function getOffset(page = 1, pageSize = PAGE_SIZE) {
  if (page < 1) page = 1;
  return (page - 1) * pageSize;
}

/**
 * Build a stable cache key for a given query, filters, and page.
 * Ensures order of filters doesn't break caching.
 */
export function buildCacheKey({ q, page, filters = {} }) {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});

  return JSON.stringify({
    q: q || "",
    page: Number(page) || 1,
    filters: sortedFilters,
  });
}
