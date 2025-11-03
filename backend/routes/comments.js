import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/// Add a comment (for media or playlist)
router.post("/", async (req, res) => {
  try {
    const { username, mediaTmdbId, playlistId, content } = req.body;

    if (!username || !content || (!mediaTmdbId && !playlistId)) {
      return res
        .status(400)
        .json({ error: "Missing username, content, mediaTmdbId, or playlistId." });
    }

    const newComment = await prisma.comment.create({
      data: {
        userUsername: username,
        mediaTmdbId,
        playlistId,
        content,
      },
    });

    res.status(201).json({ message: "Comment added successfully.", newComment });
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ error: "Failed to add comment." });
  }
});


/// Get all comments for a specific media item
router.get("/media/:tmdbId", async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { mediaTmdbId: Number(tmdbId) },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch media comments." });
  }
});


/// Get all comments for a specific playlist
router.get("/playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { playlistId: Number(playlistId) },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist comments." });
  }
});


/// Update a comment by ID
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Missing updated content." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });

    res.json({ message: "Comment updated successfully.", updatedComment });
  } catch (err) {
    console.error("Failed to update comment:", err);
    res.status(500).json({ error: "Failed to update comment." });
  }
});


/// Delete a comment by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Failed to delete comment:", err);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

export default router;