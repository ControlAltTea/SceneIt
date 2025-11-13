// src/components/GenreFilter.jsx
import React, { useEffect, useState } from "react";

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;  // <-- from your .env
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;  // <-- needed for auth

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch("https://api.themoviedb.org/3/genre/tv/list", {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }

    loadGenres();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(g.name)}
          className={`px-4 py-2 rounded-full border text-sm transition
            ${
              value === g.name
                ? "bg-orange-500 text-white border-orange-600"
                : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
            }
          `}
        >
          {g.name}
        </button>
      ))}

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="px-3 py-2 rounded-full bg-red-500 text-white text-xs"
        >
          Clear
        </button>
      )}
    </div>
  );
}
