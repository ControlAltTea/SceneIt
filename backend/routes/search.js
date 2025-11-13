// backend/src/routes/search.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Keep this aligned with your Prisma enum Genre
const ALLOWED_GENRES = new Set([
  "ACTION","COMEDY","DRAMA","FANTASY","HORROR","ROMANCE","SCIFI","THRILLER","ANIMATION",
]);

// Utility: coerce to int safely
function toInt(n, fallback) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

router.get("/search", async (req, res) => {
  try {
    const {
      q = "",
      genre,
      year,
      username,
      inPublicPlaylists,  // expected "true" to filter only public playlists
      limit = "20",
      offset = "0",
    } = req.query;

    // Build Prisma "where"
    const where = {};

    // Free-text search on Media.title/description (case-insensitive)
    const qTrim = String(q).trim();
    if (qTrim) {
      where.OR = [
        { title:       { contains: qTrim, mode: "insensitive" } },
        { description: { contains: qTrim, mode: "insensitive" } },
      ];
    }

    // Year → maps to Media.releaseYear (Int?)
    const yearInt = toInt(year, null);
    if (yearInt !== null) {
      where.releaseYear = yearInt;
    }

    // Genre → maps to Media.genres enum[]
    if (genre && ALLOWED_GENRES.has(String(genre).toUpperCase())) {
      where.genres = { has: String(genre).toUpperCase() };
    }

    // Username / Public playlist filters via PlaylistMedia → Playlist
    // Only add this block if we actually have constraints
    const wantPublicOnly = String(inPublicPlaylists) === "true";
    const wantOwner = username && String(username).trim();

    if (wantPublicOnly || wantOwner) {
      const playlistWhere = {};
      if (wantPublicOnly) playlistWhere.isPublic = true;

      // NOTE: Your Playlist model has ownerUsername (String) and relation "User"
      // Case-insensitive equality isn't supported on equals; use exact match or normalize.
      if (wantOwner) {
        playlistWhere.ownerUsername = String(username).trim();
      }

      // Media has relation field: PlaylistMedia PlaylistMedia[]
      // And PlaylistMedia has relation field "Playlist"
      where.PlaylistMedia = {
        some: { Playlist: playlistWhere },
      };
    }

    // Pagination
    const take = Math.max(1, Math.min(50, toInt(limit, 20)));
    const skip = Math.max(0, toInt(offset, 0));

    // Query
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: "desc" },
        // You can include related data if your frontend needs it:
        // include: {
        //   PlaylistMedia: {
        //     include: { Playlist: true }
        //   }
        // }
      }),
      prisma.media.count({ where }),
    ]);

    res.json({ items, total });
  } catch (err) {
    console.error("GET /api/search error:", err);
    // Avoid leaking internal details to client
    res.status(500).json({ error: "Internal error while searching" });
  }
});

export default router;
