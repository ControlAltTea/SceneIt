import React from "react";

export function Pagination({
  page,
  pageCount,
  onPageChange,
}) {
  if (pageCount <= 1) return null;

  const handleChange = (newPage) => {
    if (newPage < 1 || newPage > pageCount || newPage === page) return;
    onPageChange(newPage);
  };

  // Simple window of page numbers (e.g. show 1–5, 2–6, etc.)
  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > pageCount) {
      end = pageCount;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="pagination"
      aria-label="Search results pagination"
    >
      <div className="pagination-inner">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => handleChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Prev
        </button>

        <div className="pagination-pages">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`pagination-btn ${
                p === page ? "pagination-btn--active" : ""
              }`}
              onClick={() => handleChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pagination-btn"
          onClick={() => handleChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
