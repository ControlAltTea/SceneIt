import express from "express";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all playlists for a user
router.get("/", async (req, res) => {
    try {
        const playlists = await prisma.customPlaylist.findMany({
            where: { user_id: req.user.id },
            include: {
                items: {
                    include: { show: true },
                },
            },
        });
        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// Creates a new playlist
router.post("/", async (req, res) => {
    const { name, description } = req.body;
    try {
        const newPlaylist = await prisma.customPlaylist.create({
            data: {
                user_id: req.user.id,
                name,
                description,
            },
        });
        res.json(newPlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create playlist" });
    }
});

// Adds title to a playlist
router.post("/:playlistId/add", async (req, res) => {
    const { playlistId } = req.params;
    const { show_id } = req.body;
    try {
        const item = await prisma.playlistItem.create({
            data: {
                playlist_id: Number(playlistId),
                show_id,
            },
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add show to playlist" });
    }
});

// Remove show from playlist
router.delete("/:playlistId/remove/:showId", async (req, res) => {
    const { playlistId, showId } = req.params;

    try {
        await prisma.playlistItem.deleteMany({
            where: {
                playlist_id: Number(playlistId),
                show_id: Number(showId),
            },
        });
        res.json({ message: "Show removed from playlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove show" });
    }
});

export default router;
