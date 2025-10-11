import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

///// Creates favorite -- adds a show to a user's list of favorites.
router.post('/', async (req, res) => {
  try {
    const { userId, showId } = req.body;

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        show: { connect: { id: Number(showId) } }
      }
    });

    res.status(201).json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite. Please try again" });
  }
});


///// get /favorites/:userId -- fetches all of the favorites for a given user
router.get("/:userId", async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.params.userId },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites. Please try again." });
  }
});

///// delete /favorite/:id removes favorite entry by its unique ID
router.delete("/:id", async (req, res) => {
  try {
    await prisma.favorite.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete favorite. Please try again." });
  }
});

export default router;