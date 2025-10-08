import express from 'express';
import { PrismaClient } from  '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

///// Post the /favorites route
router.post('/', async (req, res) => {
    try {
        const { userId, titleId, titleName } = req.body;
        const favorite = await prisma.favorite.create({ 
            data: { userId, titleId, titleName },
        });
        res.status(201).json(favorite);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add favorite. Please try again"})
    }
})

///// GET /favorites/:userId
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
  
  ///// DELETE /favorites/:id
  router.delete("/:id", async (req, res) => {
    try {
      await prisma.favorite.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete favorite. Please try again." });
    }
  });
  
  export default router;