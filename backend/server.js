// import express from "express";
// import verifyToken from "./middleware/auth.js";     // default import (see auth.js below)
// import showRouter from "./routes/show.js";
// import jwt from "jsonwebtoken";                     // ✅ use default import

// const app = express();
// app.use(express.json());

// // Public login to mint a test token
// app.post("/auth/login", (req, res) => {
//   try {
//     const user = { id: 1, email: "tester@example.com", role: "tester" };
//     const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
//     return res.json({ token, user });
//   } catch (e) {
//     console.error("LOGIN_ERROR:", e);
//     return res.status(500).json({ success: false, error: "Login failed" });
//   }
// });

// // Public
// app.get("/health", (_req, res) => res.json({ ok: true }));

// // Protected probe
// app.get("/private/ping", verifyToken, (req, res) => {
//   res.json({ ok: true, user: req.user ?? null });
// });

// // Protect your shows API
// app.use("/shows", verifyToken, showRouter);

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));


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
