import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ShowCard from "../components/ShowCard";
import GenreFilter from "../components/GenreFilter";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// TODO:
// 1. FIX API_KEY TO AT LEAST FUNCTION WHEN SEARCHING FOR TITLES
// 2. CREATE COMPONENT FOR CATEGORY FILTERING, STARTING WITH A GENRE BUTTON
// 3. RENDERING ON THE SEARCH PAGE
  //  USE: https://developer.themoviedb.org/reference/genre-tv-list TO REQUEST THE AVAILABLE GENRES
// 4. CLICK GENRE BUTTON COMPONENT TO REVEAL CATEGORY OPTIONS
// 5. EXAMPLE: CLICKING GENRE DISPLAYS 'COMEDY', 'ACTION & ADVENTURE'
 // 6. CLICKING COMEDY FITLER ALL THE COMEDY TV SHOWS AVAILABLE UNDER THE 'COMEDY' GENRE
// Change 'results' object to store the filtered data

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await (
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        console.log("TMDB response:", data); // 👀 check this in devtools
        setResults(data.results || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
  <div className="bg-primary min-h-screen text-white"> 
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Showing results for "{query}"
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && (
        <p>No results found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
        {/* Genre filter chips */}
      <div className="space-y-2 md:col-span-3">
        <label className="block text-sm text-gray-300">Genre</label>
        <GenreFilter
          value={genre}                       // from useSearchParams
          onChange={(val) => updateParam("genre", val)}
  />
</div>
<div className="grid gap-3 md:grid-cols-5">
  <input
    className="border rounded px-3 py-2 text-black"
    placeholder="Search by title…"
    value={q}
    onChange={(e) => updateParam("q", e.target.value)}
  />

  {/* NEW GENRE FILTER */}
  <div className="space-y-2">
    <label className="block text-sm text-gray-300">Genre</label>
    <GenreFilter
      value={genre}                       // from useSearchParams
      onChange={(val) => updateParam("genre", val)}
    />
  </div>

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


      </div>
    </div>
    </div>
  );
};

export default Search;
