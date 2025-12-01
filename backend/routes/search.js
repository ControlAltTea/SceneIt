// backend/src/routes/search.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { buildShowWhere } from "../utils/buildShowWhere.js";

const prisma = new PrismaClient();
const router = express.Router();

const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

// Utility: safely coerce to int
function toInt(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

// GET /api/search
router.get("/search", async (req, res) => {
  try {
    const {
      q = "",
      genre,
      year,
      username,
      inPublicPlaylists, // expected "true" to filter only public playlists
      limit,
      offset,
    } = req.query;

    // ---------- Build Prisma "where" via helper ----------
    const where = buildShowWhere({
      q,
      genre,
      year,
      username,
      inPublicPlaylists,
    });

    // ---------- Pagination ----------
    // Prefer explicit `limit`/`offset` if provided, otherwise fall back to PAGE_SIZE
    const take = Math.max(1, Math.min(50, toInt(limit, PAGE_SIZE)));
    const skip = Math.max(0, toInt(offset, 0));
    // ---------- Query DB ----------
    const [items, total] = await Promise.all([
      prisma.show.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: "desc" },
        // include related data if needed by frontend
        // include: {
        //   PlaylistMedia: {
        //     include: { Playlist: true },
        //   },
        // },
      }),
      prisma.media.count({ where }),
    ]);

    const page = Math.floor(skip / take) + 1;
    const totalPages = Math.max(1, Math.ceil(total / take));

    res.json({
      items,
      total,
      page,
      pageSize: take,
      totalPages,
    });
  } catch (err) {
    console.error("GET /api/search error:", err);
    res.status(500).json({ error: "Internal error while searching" });
  }
});

export default router;
