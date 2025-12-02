import React from "react";
import "./GenreFilter.css"; 

const GENRES = [
  "ACTION",
  "COMEDY",
  "DRAMA",
  "FANTASY",
  "HORROR",
  "ROMANCE",
  "SCIFI",
  "THRILLER",
  "ANIMATION",
];

export default function GenreFilter({ selectedGenre, onChange }) {
  return (
    <div className="genre-filter-box">
      <h3 className="genre-filter-label">Genre</h3>
      <div className="genre-chip-container">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => onChange(g)}
            className={`genre-chip ${selectedGenre === g ? "active" : ""}`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}