import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later
const FALLBACK_IMG = "https://via.placeholder.com/500x750?text=No+Image";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export default function ShowCard({ show }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  
  // id to use in routes
  const id = show.id ?? show.tmdbId ?? show.mediaTmdbId ?? show.showId;

  // title
  const title =
    show.title ??
    show.name ??
    show.original_title ??
    "Untitled";

  // year
  const year =
    show.year ??
    show.releaseYear ??
    (show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined) ??
    (show.release_date ? new Date(show.release_date).getFullYear() : undefined);

  // rating (TMDB or any custom field you may expose later)
  const rating =
    typeof show.vote_average === "number"
      ? show.vote_average.toFixed(1)
      : typeof show.rating === "number"
      ? show.rating.toFixed(1)
      : null;

  // poster url: prefer absolute DB url; otherwise TMDB path
  let posterSrc = FALLBACK_IMG;
  if (show.posterUrl) {
    posterSrc = show.posterUrl.startsWith("http")
      ? show.posterUrl
      : `${TMDB_IMG}${show.posterUrl}`;
  } else if (show.poster_path) {
    posterSrc = `${TMDB_IMG}${show.poster_path}`;
  } else if (show.poster) {
    posterSrc = show.poster.startsWith("http")
      ? show.poster
      : `${TMDB_IMG}${show.poster}`;
  }

  // genres (enum[] from DB or array of strings)
  const genres = Array.isArray(show.genres) ? show.genres : [];

  return (
    <div
      onClick={() => id && navigate(`/show/${id}`)}
      className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="link"
      aria-label={`Open details for ${title}`}
    >
      <img
        src={posterSrc}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hovered ? "opacity-50" : "opacity-100"
        }`}
        loading="lazy"
      />

      {/* Overlay on hover */}
      {hovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-3 bg-black/60">
          <h2 className="text-lg font-bold line-clamp-2">{title}</h2>
          {year && <p className="text-sm text-gray-200 mt-1">{year}</p>}
          {rating && <p className="text-sm mt-1">⭐ {rating}</p>}
          {genres.length > 0 && (
            <p className="text-xs text-gray-200 mt-2 line-clamp-2">
              {genres.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


