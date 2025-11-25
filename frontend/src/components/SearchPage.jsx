import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchWithCache } from "../hooks/useSearchWithCache";
import { Pagination } from "../components/Pagination";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  const filters = {
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
  };

  const {
    results,
    total,
    status,
    error,
    page: currentPage,
    pageCount,
    pageSize,
  } = useSearchWithCache({ q, page, filters });

  const handlePageChange = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nextQ = formData.get("q")?.toString() || "";
    const nextGenre = formData.get("genre")?.toString() || "";
    const nextYear = formData.get("year")?.toString() || "";
    const nextRating = formData.get("rating")?.toString() || "";

    const nextParams = new URLSearchParams();
    if (nextQ) nextParams.set("q", nextQ);
    if (nextGenre) nextParams.set("genre", nextGenre);
    if (nextYear) nextParams.set("year", nextYear);
    if (nextRating) nextParams.set("rating", nextRating);
    nextParams.set("page", "1"); // reset to first page on new search

    setSearchParams(nextParams);
  };

  const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  return (
    <main className="search-page">
      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search shows…"
          aria-label="Search shows"
        />
        {/* Example filter controls */}
        <select name="genre" defaultValue={filters.genre}>
          <option value="">All genres</option>
          {/* map genres here */}
        </select>

        <input
          name="year"
          defaultValue={filters.year}
          placeholder="Year"
          aria-label="Filter by year"
        />
        <select name="rating" defaultValue={filters.rating}>
          <option value="">Any rating</option>
          <option value="pg">PG</option>
          <option value="pg-13">PG-13</option>
          {/* etc */}
        </select>

        <button type="submit">Search</button>
      </form>

      {/* Status / Empty / Error */}
      {status === "idle" && !q && (
        <p>Start by searching for a show or movie.</p>
      )}

      {status === "loading" && (
        <div className="results-skeleton">
          Loading results…
          {/* you can use skeleton cards here */}
        </div>
      )}

      {status === "error" && (
        <div className="results-error">
          <p>Something went wrong. Please try again.</p>
          <button onClick={() => handlePageChange(currentPage)}>
            Retry
          </button>
          <p className="text-xs text-gray-500">
            {error?.message}
          </p>
        </div>
      )}

      {status === "success" && results.length === 0 && (
        <p>No results found. Try a different search or filters.</p>
      )}

      {status === "success" && results.length > 0 && (
        <>
          <p className="results-summary">
            Showing {startIndex}–{endIndex} of {total} results • Page{" "}
            {currentPage} of {pageCount}
          </p>

          <section
            className="results-grid"
            aria-label="Search results"
          >
            {results.map((item) => (
              <article key={item.id} className="result-card">
                {/* your card UI */}
                <h3>{item.title}</h3>
                {/* poster, overview, etc */}
              </article>
            ))}
          </section>

          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
