import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


/// POST /ratings
/// Create or update a user's rating for a media item or playlist.
/// Frontend div inside of thestar component will send `rating` (1–5) and either mediaTmdbId or playlistId.

router.post("/", async (req, res) => {
  try {
    const { username, mediaTmdbId, playlistId, rating } = req.body;

    if (!username || (!mediaTmdbId && !playlistId)) {
      return res
        .status(400)
        .json({ error: "Missing username, mediaTmdbId, or playlistId." });
    }

    // Optional guard: rating must be 1–5 (frontend restricts this, but backend check is safer)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    // Rating a movie or show
    if (mediaTmdbId) {
      rating = await prisma.rating.upsert({
        where: {
          userUsername_mediaTmdbId: {
            userUsername: username,
            mediaTmdbId,
          },
        },
        update: { rating: rating },
        create: {
          userUsername: username,
          mediaTmdbId,
          rating: rating
        },
      });
    }

    /// Rating a playlist
    if (playlistId) {
      rating = await prisma.rating.upsert({
        where: {
          userUsername_playlistId: {
            userUsername: username,
            playlistId,
          },
        },
        update: { rating },
        create: {
          userUsername: username,
          playlistId,
          rating,
        },
      });
    }

    res.status(201).json({ message: "Rating saved successfully.", rating });
  } catch (err) {
    console.error("Failed to create/update rating:", err);
    res.status(500).json({ error: "Failed to create/update rating." });
  }
});


/// GET /ratings/media/:tmdbId
/// Get all ratings for a specific media item

router.get("/media/:tmdbId", async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { mediaTmdbId: Number(tmdbId) },
      include: { user: { select: { username: true } } },
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch media ratings." });
  }
});


/// Get all ratings for a specific playlist

router.get("/playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { playlistId: Number(playlistId) },
      include: { user: { select: { username: true } } },
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist ratings." });
  }
});

/// Remove a user's rating for a media item or playlist
router.delete("/", async (req, res) => {
  try {
    const { username, mediaTmdbId, playlistId } = req.body;

    if (!username || (!mediaTmdbId && !playlistId)) {
      return res
        .status(400)
        .json({ error: "Missing username, mediaTmdbId, or playlistId." });
    }

    let deleted;

    if (mediaTmdbId) {
      deleted = await prisma.rating.delete({
        where: {
          userUsername_mediaTmdbId: { userUsername: username, mediaTmdbId },
        },
      });
    }

    if (playlistId) {
      deleted = await prisma.rating.delete({
        where: {
          userUsername_playlistId: { userUsername: username, playlistId },
        },
      });
    }

    res.json({ message: "Rating deleted successfully.", deleted });
  } catch (err) {
    console.error("Failed to delete rating:", err);
    res.status(500).json({ error: "Failed to delete rating." });
  }
});

export default router;
