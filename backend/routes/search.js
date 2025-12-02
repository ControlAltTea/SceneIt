// backend/routes/search.js
import express from "express";

const router = express.Router();

// Read TMDB credentials from backend environment
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
const TMDB_TOKEN = process.env.TMDB_TOKEN || process.env.VITE_TMDB_TOKEN;

// Helper to safely convert to int
function toInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Map Scene It genre names → TMDB TV genre IDs
const GENRE_NAME_TO_ID = {
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  ROMANCE: 10749,
  SCIFI: 10765,     // Sci-Fi & Fantasy
  FANTASY: 10765,   // same TMDB bucket
  ACTION: 10759,    // Action & Adventure
  ANIMATION: 16,
};

// Generic helper to call TMDB (Node 18+ has global fetch)
async function callTmdb(path, queryParams = {}) {
  if (!TMDB_API_KEY) {
    console.error("❌ TMDB_API_KEY is missing in backend env");
    throw new Error("TMDB API key not configured on backend");
  }

  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  console.log("TMDB request:", url.toString());

  const res = await fetch(url.toString(), {
    headers: TMDB_TOKEN
      ? {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("TMDB error:", res.status, text);
    throw new Error(`TMDB responded with status ${res.status}`);
  }

  return res.json();
}

// GET /api/search
router.get("/search", async (req, res) => {
  try {
    const {
      q = "",
      genre,
      year,
      limit = "20",
      offset = "0",
    } = req.query;

    console.log("🔎 /api/search query:", req.query);

    // ----- Pagination: offset/limit → TMDB page -----
    const take = Math.max(1, Math.min(50, toInt(limit, 20)));
    const skip = Math.max(0, toInt(offset, 0));
    const page = Math.floor(skip / take) + 1;

    const hasQuery = String(q).trim().length > 0;
    const endpoint = hasQuery ? "search/tv" : "trending/tv/week";

    const tmdbParams = {
      language: "en-US",
      page,
    };

    if (hasQuery) {
      tmdbParams.query = String(q).trim();
      tmdbParams.include_adult = "false";
    }

    const data = await callTmdb(endpoint, tmdbParams);
    let results = data.results || [];

    // ----- Genre filter (using TMDB genre_ids) -----
    if (genre && genre !== "ALL") {
      const genreKey = String(genre).toUpperCase();
      const tmdbGenreId = GENRE_NAME_TO_ID[genreKey];

      if (tmdbGenreId) {
        results = results.filter((show) =>
          (show.genre_ids || []).includes(tmdbGenreId)
        );
      }
    }

    // ----- Year filter (using first_air_date) -----
    if (year) {
      const yearInt = toInt(year, null);
      if (yearInt !== null) {
        results = results.filter((show) => {
          const firstAir = show.first_air_date || "";
          const showYear = firstAir.slice(0, 4);
          return String(yearInt) === showYear;
        });
      }
    }

    // username + inPublicPlaylists are not handled here yet (that would be DB-based)

    res.json({
      items: results,                // your ShowCard uses id, name/title, poster_path, vote_average
      totalResults: data.total_results,
      page,
      pageSize: take,
      totalPages: data.total_pages,
      source: "tmdb",
    });
  } catch (err) {
    console.error("GET /api/search error:", err);
    res.status(500).json({ error: "Internal error while searching (TMDB)" });
  }
});

export default router;
