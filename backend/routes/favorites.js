import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /favorites
 * Adds a show to a user's list of favorites.
 * If the show doesn't exist in the database yet, it will be created (upsert).
 */
router.post('/', async (req, res) => {
  try {
    const { userId, tmdbId, title, posterUrl } = req.body;

    if (!userId || !tmdbId || !title) {
      return res.status(400).json({ error: "Missing required fields: userId, tmdbId, or title." });
    }

    // Ensure the show exists (create if it doesn’t)
    const show = await prisma.show.upsert({
      where: { tmdbId: Number(tmdbId) },
      update: {},
      create: {
        tmdbId: Number(tmdbId),
        title,
        posterUrl: posterUrl || null,
      },
    });

    // Create the favorite record linked to the show
    const favorite = await prisma.favorite.create({
      data: {
        userId: Number(userId),
        show: { connect: { id: show.id } },
      },
      include: { show: true },
    });

    res.status(201).json(favorite);
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite. Please try again." });
  }
});

/**
 * GET /favorites/:userId
 * Fetches all favorites for a given user, including show details.
 */
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(req.params.userId) },
      include: { show: true },
    });

    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites. Please try again." });
  }
});


// DELETE /favorites/:id
// Removes a favorite entry by its unique ID.

router.delete('/:id', async (req, res) => {
  try {
    await prisma.favorite.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ error: "Failed to delete favorite. Please try again." });
  }
});

export default router;
