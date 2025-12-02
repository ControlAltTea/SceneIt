// // TODO:
// // 1. FIX API_KEY TO AT LEAST FUNCTION WHEN SEARCHING FOR TITLES
// // 2. CREATE COMPONENT FOR CATEGORY FILTERING, STARTING WITH A GENRE BUTTON
// // 3. RENDERING ON THE SEARCH PAGE
//   //  USE: https://developer.themoviedb.org/reference/genre-tv-list TO REQUEST THE AVAILABLE GENRES
// // 4. CLICK GENRE BUTTON COMPONENT TO REVEAL CATEGORY OPTIONS
// // 5. EXAMPLE: CLICKING GENRE DISPLAYS 'COMEDY', 'ACTION & ADVENTURE'
//  // 6. CLICKING COMEDY FITLER ALL THE COMEDY TV SHOWS AVAILABLE UNDER THE 'COMEDY' GENRE
// // Change 'results' object to store the filtered data

// frontend/src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowCard from "../components/ShowCard";
import GenreFilter from "../components/GenreFilter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Search() {
  const [params, setParams] = useSearchParams();

  // URL params → state-ish values
  const q = params.get("q") || "";
  const genre = params.get("genre") || "ALL";
  const year = params.get("year") || "";
  const username = params.get("username") || "";
  const inPublicPlaylists = params.get("inPublicPlaylists") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // helper to update query string
  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // always reset pagination when filters change (optional)
    next.delete("offset");
    setParams(next);
  }

  // fetch from your backend search route
  async function fetchResults() {
    setLoading(true);
    setError("");
    try {
      const searchParams = new URLSearchParams();

      if (q) searchParams.set("q", q);
      if (genre && genre !== "ALL") searchParams.set("genre", genre);
      if (year) searchParams.set("year", year);
      if (username) searchParams.set("username", username);
      if (inPublicPlaylists === "true") {
        searchParams.set("inPublicPlaylists", "true");
      }

      // pagination defaults
      searchParams.set("limit", "20");
      searchParams.set("offset", params.get("offset") || "0");

      const res = await fetch(
        `${API_BASE}/api/search?${searchParams.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Search failed with status ${res.status}`);
      }

      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to load results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // re-run when filters change
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, genre, year, username, inPublicPlaylists]);

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold">
          Showing results for{" "}
          <span className="text-pink-400">
            "{q || "All"}"
          </span>
        </h1>

        {/* ---------- FILTER PANEL ---------- */}
        <div className="bg-[#041826] rounded-2xl border border-white/10 p-5 shadow-lg">
          <div className="grid gap-4 md:grid-cols-[2fr,2fr,1fr,1.4fr,auto] items-start">
            {/* Search by title */}
            <div className="space-y-1">
              <label className="block text-sm text-gray-300">
                Search by title
              </label>
              <input
                className="w-full rounded-xl px-3 py-2 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="e.g. The Office"
                value={q}
                onChange={(e) => updateParam("q", e.target.value)}
              />
            </div>

            {/* Genre box (your custom GenreFilter component) */}
            <div>
              <GenreFilter
                selectedGenre={genre}
                onChange={(val) => updateParam("genre", val)}
              />
            </div>

            {/* Year */}
            <div className="space-y-1">
              <label className="block text-sm text-gray-300">Year</label>
              <input
                className="w-full rounded-xl px-3 py-2 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                type="number"
                placeholder="1995"
                value={year}
                onChange={(e) => updateParam("year", e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="block text-sm text-gray-300">
                Username (playlist owner)
              </label>
              <input
                className="w-full rounded-xl px-3 py-2 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="e.g. karlita2227"
                value={username}
                onChange={(e) => updateParam("username", e.target.value)}
              />
            </div>

            {/* Public playlist toggle */}
            <div className="flex flex-col justify-end">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={inPublicPlaylists === "true"}
                  onChange={(e) =>
                    updateParam(
                      "inPublicPlaylists",
                      e.target.checked ? "true" : ""
                    )
                  }
                />
                <span>Public Playlists</span>
              </label>
            </div>
          </div>
        </div>

        {/* ---------- RESULTS ---------- */}
        {error && (
          <p className="text-red-400 text-sm">Error: {error}</p>
        )}

        {loading && <p>Loading results…</p>}

        {!loading && !error && results.length === 0 && (
          <p>No results found.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
