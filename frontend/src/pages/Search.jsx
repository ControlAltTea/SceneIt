import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ShowCard from "../components/ShowCard";
import { fetchPage } from "../utils/paginationHelpers.jsx"; 


const GENRES = [
  "ACTION","COMEDY","DRAMA","FANTASY","HORROR","ROMANCE","SCIFI","THRILLER","ANIMATION"
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL params
  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const username = searchParams.get("username") || "";
  const inPublicPlaylists = searchParams.get("inPublicPlaylists") || "true";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const filters = { genre, year, username, inPublicPlaylists };
    setLoading(true);
    setErr(null);
    fetchPage({ q, filters, page })
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, genre, year, username, inPublicPlaylists, page]);

  function updateParam(name, value) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value) p.set(name, value);
      else p.delete(name);
      // reset to first page when filters/search change
      if (name !== "page") p.set("page", "1");
      return p;
    }, { replace: false });
  }

  function goToPage(next) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(next));
      return p;
    }, { replace: false });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-5">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search by title…"
          value={q}
          onChange={(e) => updateParam("q", e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={genre}
          onChange={(e) => updateParam("genre", e.target.value)}
        >
          <option value="">Genre (any)</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <input
          className="border rounded px-3 py-2"
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => updateParam("year", e.target.value)}
        />

        <input
          className="border rounded px-3 py-2"
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
          <span>Only in public playlists</span>
        </label>
      </div>

      {/* Status */}
      {loading && <div className="animate-pulse text-gray-600">Loading results…</div>}
      {err && <div className="text-red-600">Error: {err}</div>}

      {/* Results */}
      {data && (
        <>
          <div className="text-sm text-gray-600">
            Showing {(data.page - 1) * data.pageSize + 1}
            –
            {Math.min(data.total, data.page * data.pageSize)} of {data.total} • Page {data.page} / {data.pageCount}
          </div>

          {data.items?.length === 0 ? (
            <div className="text-gray-700">No results. Try adjusting filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.items.map((s) => (
                <div key={s.id} className="border rounded-lg p-3">
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-gray-600">{s.year}</div>
                  {Array.isArray(s.genres) && s.genres.length > 0 && (
                    <div className="text-xs text-gray-700 mt-1">
                      Genres: {s.genres.join(", ")}
                    </div>
                  )}
                  {Array.isArray(s.playlists) && s.playlists.length > 0 && (
                    <div className="text-xs text-gray-700 mt-2">
                      In public playlists:
                      <ul className="list-disc ml-5">
                        {s.playlists.map((p) => (
                          <li key={p.id}>
                            {p.name} {p.owner?.username ? `(by ${p.owner.username})` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-100"
                disabled={data.page <= 1}
                onClick={() => goToPage(data.page - 1)}
                aria-label="Previous page"
              >
                Prev
              </button>

              {/* show a small window of pages; adjust as needed */}
              {Array.from({ length: data.pageCount })
                .slice(0, 7)
                .map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={`border px-3 py-1 rounded ${
                        p === data.page ? "bg-blue-500 text-white font-semibold" : "hover:bg-gray-100"
                      }`}
                      aria-current={p === data.page ? "page" : undefined}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}

              <button
                className="border px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-100"
                disabled={data.page >= data.pageCount}
                onClick={() => goToPage(data.page + 1)}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later

// export default Search;

// const Search = () => {
//   const location = useLocation();
//   const query = new URLSearchParams(location.search).get("query") || "";
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query) return;

//     const fetchResults = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
//             query
//           )}&api_key=${API_KEY}&language=en-US&page=1`
//         );
//         const data = await res.json();
//         console.log("TMDB response:", data); // 👀 check this in devtools
//         setResults(data.results || []);
//       } catch (err) {
//         console.error("Error fetching search results:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query]);

//   return (
//   <div className="bg-primary min-h-screen text-white"> 
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       <h1 className="text-2xl font-bold mb-4">
//         Showing results for "{query}"
//       </h1>

//       {loading && <p>Loading...</p>}

//       {!loading && results.length === 0 && (
//         <p>No results found.</p>
//       )}

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {results.map((show) => (
//           <ShowCard key={show.id} show={show} />
//         ))}
//       </div>
//     </div>
//     </div>
//   );
// };

// // export default Search;
