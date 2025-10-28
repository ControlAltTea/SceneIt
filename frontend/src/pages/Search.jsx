import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ShowCard from "../components/ShowCard";

const GENRES = ["ACTION","COMEDY","DRAMA","FANTASY","HORROR","ROMANCE","SCIFI","THRILLER","ANIMATION"];

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later

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
        const res = await fetch(
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
        {/* Filters Section */}
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
    placeholder="Username"
    value={username}
    onChange={(e) => updateParam("username", e.target.value)}
  />

  <label className="inline-flex items-center gap-2">
    <input
      type="checkbox"
      checked={inPublicPlaylists === "true"}
      onChange={(e) => updateParam("inPublicPlaylists", e.target.checked ? "true" : "")}
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
