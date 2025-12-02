// // backend/routes/search.js
// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import { buildShowWhere } from "../utils/buildShowWhere.js";

// const prisma = new PrismaClient();
// const router = express.Router();

// const PAGE_SIZE = 20;

// function toInt(value, fallback) {
//   const num = Number(value);
//   return Number.isFinite(num) ? num : fallback;
// }

// router.get("/search", async (req, res) => {
//   try {
//     const {
//       q,
//       genre,
//       year,
//       username,
//       inPublicPlaylists,
//       limit,
//       offset,
//     } = req.query;

//     // 1️⃣ Build correct where clause for Media model
//     const where = buildShowWhere({
//       q,
//       genre,
//       year,
//       username,
//       inPublicPlaylists,
//     });

//     // 2️⃣ Pagination MUST be defined before using skip/take
//     const take = Math.max(1, Math.min(50, toInt(limit, PAGE_SIZE)));
//     const skip = Math.max(0, toInt(offset, 0));

//     // 3️⃣ Query Media model (team's actual schema)
//     const [items, total] = await Promise.all([
//       prisma.media.findMany({
//         where,
//         skip,
//         take,
//         orderBy: { updatedAt: "desc" },
//         include: {
//           PlaylistMedia: {
//             include: { Playlist: true },
//           },
//         },
//       }),
//       prisma.media.count({ where }),
//     ]);

//     // 4️⃣ Pagination metadata
//     const page = Math.floor(skip / take) + 1;
//     const totalPages = Math.max(1, Math.ceil(total / take));

//     // 5️⃣ Return JSON response
//     res.json({
//       items,
//       total,
//       page,
//       pageSize: take,
//       totalPages,
//     });
//   } catch (err) {
//     console.error("GET /api/search ERROR:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// export default router;

// backend/routes/search.js
import express from "express";

const router = express.Router();

// 🔹 Dummy in-memory "shows" for Scene It search
const ALL_SHOWS = [
  {
    id: 1,
    tmdbId: 1001,
    title: "Laugh Out Loud",
    description: "A hilarious comedy about friends navigating life.",
    genre: "COMEDY",
    releaseYear: 2021,
    posterPath: "/dummy-comedy-1.jpg",
  },
  {
    id: 2,
    tmdbId: 1002,
    title: "Space Adventures",
    description: "Sci-fi epic with space battles and mystery.",
    genre: "SCIFI",
    releaseYear: 2019,
    posterPath: "/dummy-scifi-1.jpg",
  },
  {
    id: 3,
    tmdbId: 1003,
    title: "Love in the City",
    description: "Romantic drama set in a bustling city.",
    genre: "ROMANCE",
    releaseYear: 2020,
    posterPath: "/dummy-romance-1.jpg",
  },
  {
    id: 4,
    tmdbId: 1004,
    title: "Night Terrors",
    description: "A chilling horror anthology.",
    genre: "HORROR",
    releaseYear: 1991,
    posterPath: "/dummy-horror-1.jpg",
  },
  {
    id: 5,
    tmdbId: 1005,
    title: "Courtroom Clash",
    description: "Intense drama in the courtroom.",
    genre: "DRAMA",
    releaseYear: 1991,
    posterPath: "/dummy-drama-1.jpg",
  },
];

// small helper
function toInt(val, fallback) {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

// GET /api/search (dummy implementation)
router.get("/search", (req, res) => {
  try {
    const {
      q = "",
      genre,
      year,
      // username,
      // inPublicPlaylists,
      limit = "20",
      offset = "0",
    } = req.query;

    let filtered = [...ALL_SHOWS];

    // 🔍 free-text search on title + description
    const qTrim = String(q).trim().toLowerCase();
    if (qTrim) {
      filtered = filtered.filter(
        (show) =>
          show.title.toLowerCase().includes(qTrim) ||
          (show.description || "").toLowerCase().includes(qTrim)
      );
    }

    // 🎭 genre filter
    if (genre && genre !== "ALL") {
      const g = String(genre).toUpperCase();
      filtered = filtered.filter(
        (show) => String(show.genre).toUpperCase() === g
      );
    }

    // 📅 year filter
    if (year) {
      const y = Number(year);
      if (Number.isInteger(y)) {
        filtered = filtered.filter((show) => show.releaseYear === y);
      }
    }

    // (username & public playlists would go here if we wanted to simulate them)

    // 📄 pagination
    const take = Math.max(1, Math.min(50, toInt(limit, 20)));
    const skip = Math.max(0, toInt(offset, 0));

    const total = filtered.length;
    const pageItems = filtered.slice(skip, skip + take);
    const page = Math.floor(skip / take) + 1;
    const totalPages = Math.max(1, Math.ceil(total / take));

    res.json({
      items: pageItems,
      total,
      page,
      pageSize: take,
      totalPages,
    });
  } catch (err) {
    console.error("GET /api/search dummy ERROR:", err);
    res.status(500).json({ error: "Internal error while searching (dummy)" });
  }
});

export default router;
