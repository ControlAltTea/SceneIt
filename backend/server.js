// server.js
import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/**
 * GET /api/search
 * Query params:
 *  q, genre, year, username, inPublicPlaylists=('true'|''),
 *  limit=20, offset=0
 *
 * Returns: { items: Array<MediaLike>, total: number }
 */
app.get("/api/search", async (req, res) => {
  try {
    const {
      q = "",
      genre,
      year,
      username,
      inPublicPlaylists = "true",
      limit = "20",
      offset = "0",
    } = req.query;

    // ---- Build 'where' for Media ----
    const where = { AND: [] };

    // Title search
    if (q && String(q).trim()) {
      where.AND.push({
        title: { contains: String(q).trim(), mode: "insensitive" },
      });
    }

    // Genre (enum)
    if (genre && String(genre).trim()) {
      const g = String(genre).trim().toUpperCase();
      const validGenres = Object.values(Prisma.Genre || {});
      if (validGenres.includes(g)) {
        // Media.genres is enum[]
        where.AND.push({ genres: { has: g } });
      } else {
        return res.status(400).json({ error: `Invalid genre: ${genre}` });
      }
    }

    // Year
    if (year && !Number.isNaN(Number(year))) {
      where.AND.push({ releaseYear: Number(year) });
    }

    // Playlist + owner filters go through the join table PlaylistMedia
    const needPlaylistFilter =
      inPublicPlaylists === "true" || (username && String(username).trim());

    if (needPlaylistFilter) {
      const andPM = [];
      if (inPublicPlaylists === "true") {
        andPM.push({ Playlist: { isPublic: true } });
      }
      if (username && String(username).trim()) {
        andPM.push({
          Playlist: {
            ownerUsername: {
              equals: String(username).trim(),
              mode: "insensitive",
            },
          },
        });
      }

      // Media where exists PlaylistMedia that matches all AND conditions
      where.AND.push({
        PlaylistMedia: {
          some: { AND: andPM },
        },
      });
    }

    // If AND is empty, delete it (Prisma is fine either way)
    if (where.AND.length === 0) delete where.AND;

    const take = Math.max(1, Math.min(100, Number(limit) || 20));
    const skip = Math.max(0, Number(offset) || 0);

    // ---- Query DB ----
    const [rows, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" }, // you can change to updatedAt if desired
        include: {
          // Pull playlists via join table so we can show public playlists & owners
          PlaylistMedia: {
            include: {
              Playlist: {
                include: {
                  User: true, // to access User fields if you need more than username
                },
              },
            },
            // optional per-relation filter (mirrors the global one for safety)
            where: needPlaylistFilter
              ? {
                  AND: [
                    ...(inPublicPlaylists === "true" ? [{ Playlist: { isPublic: true } }] : []),
                    ...(username && String(username).trim()
                      ? [
                          {
                            Playlist: {
                              ownerUsername: {
                                equals: String(username).trim(),
                                mode: "insensitive",
                              },
                            },
                          },
                        ]
                      : []),
                  ],
                }
              : undefined,
          },
        },
      }),
      prisma.media.count({ where }),
    ]);

    // ---- Shape response for your frontend ----
    const items = rows.map((m) => ({
      id: m.tmdbId,
      tmdbId: m.tmdbId,
      title: m.title,
      year: m.releaseYear,
      genres: m.genres,
      description: m.description,
      posterUrl: m.posterUrl,
      // convert join rows to a simple playlists array
      playlists: (m.PlaylistMedia || [])
        .filter((pm) => pm?.Playlist)
        .map((pm) => ({
          id: pm.Playlist.id,
          name: pm.Playlist.name,
          isPublic: pm.Playlist.isPublic,
          owner: {
            username: pm.Playlist.ownerUsername,
            // email: pm.Playlist.User?.email, // available if you need
          },
        })),
    }));

    res.json({ items, total });
  } catch (err) {
    console.error("/api/search failed:", err);
    res.status(500).json({ error: "Search failed", details: String(err?.message || err) });
  }
});

app.get("/", (_req, res) => res.send("Scene It backend OK"));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
