import express from "express";
import cors from "cors";
import { PrismaClient, Genre } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ SEARCH ENDPOINT
app.get("/api/search", async (req, res) => {
  try {
    const { q, genre, year, username, inPublicPlaylists, page = 1 } = req.query;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const where = {};

    // Text search (title)
    if (q?.trim()) {
      where.title = { contains: q.trim(), mode: "insensitive" };
    }

    // Genre (enum)
    if (genre && Object.values(Genre).includes(genre)) {
      where.genres = { has: genre };
    }

    // Year
    if (year && !isNaN(Number(year))) {
      where.year = Number(year);
    }

    // Username & Public Playlists
    if (username || inPublicPlaylists === "true") {
      const playlistFilters = [];

      if (username?.trim()) {
        playlistFilters.push({
          playlist: {
            owner: { username: { equals: username.trim(), mode: "insensitive" } },
          },
        });
      }

      if (inPublicPlaylists === "true") {
        playlistFilters.push({ playlist: { isPublic: true } });
      }

      if (playlistFilters.length > 0) {
        where.playlists = { some: { AND: playlistFilters } };
      }
    }

    // Query DB
    const [items, total] = await Promise.all([
      prisma.show.findMany({
        where,
        include: {
          playlists: {
            include: { owner: true },
          },
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.show.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pageSize: PAGE_SIZE,
      pageCount: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error during search" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
