import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


// Helper function to get or create a user's Favorites playlist

async function getFavPlaylist(userId) {
    let favorites = await prisma.playlist.findFirst({
        where: { ownerId: userId, isFavorite: true },
    });

    if (!favorites) {
        favorites = await prisma.playlist.create({
            data: {
                name: "Favorites",
                isFavorite: true,
                isPublic: false,
                ownerId: userId,
            },
        });
    }

    return favorites;
}


// POST /playlists
// Create a new playlist (user-created, not favorites)

router.post("/", async (req, res) => {
    try {
        const { userId, name, isPublic = true } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ error: "Missing userId or name." });
        }

        const playlist = await prisma.playlist.create({
            data: {
                name,
                isPublic,
                ownerId: userId,
            },
        });

        res.status(201).json(playlist);
    } catch (err) {
        console.error("Error creating playlist:", err);
        res.status(500).json({ error: "Failed to create playlist." });
    }
});


// POST /playlists/favorites
// Add a show to the user's Favorites playlist

router.post("/favorites", async (req, res) => {
    try {
        const { userId, tmdbId, title, posterUrl } = req.body;

        if (!userId || !tmdbId || !title) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Ensure the show exists
        const show = await prisma.show.upsert({
            where: { tmdbId: String(tmdbId) },
            update: {},
            create: {
                tmdbId: String(tmdbId),
                title,
                posterUrl: posterUrl || null,
            },
        });

        // Get or create favorites playlist
        const favorites = await getFavPlaylist(userId);

        // Guard added to avoide duplicate shows being added to users' playlists
        const alreadyFavorite = await prisma.playlist.findFirst({
            where: {
                id: favorites.id,
                shows: { some: { id: show.id } },
            },
        });

        if (alreadyFavorite) {
            return res.status(200).json({ message: "Show already in favorites." });
        }


        // Connect the show
        const updatedFavorites = await prisma.playlist.update({
            where: { id: favorites.id },
            data: {
                shows: { connect: { id: show.id } },
            },
            include: { shows: true },
        });

        res.status(201).json(updatedFavorites);
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ error: "Failed to add favorite." });
    }
});



// GET /playlists/favorites/:userId
// Fetches the user's Favorites playlist

router.get("/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter." });
        }

        const favorites = await prisma.playlist.findFirst({
            where: { ownerId: userId, isFavorite: true },
            include: { shows: true },
        });

        if (!favorites) {
            return res.status(200).json({ shows: [], message: "No favorites playlist found." });
        }

        return res.status(200).json({
            id: favorites.id,
            name: favorites.name,
            shows: favorites.shows || [],
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return res.status(500).json({ error: "Failed to fetch favorites." });
    }
});


// DELETE /playlists/favorites
// Removes a show from the Favorites playlist

router.delete("/favorites", async (req, res) => {
    try {
        const { userId, showId } = req.body;

        if (!userId || !showId) {
            return res.status(400).json({ error: "Missing userId or showId in request body." });
        }

        const favorites = await prisma.playlist.findFirst({
            where: { ownerId: userId, isFavorite: true },
        });

        if (!favorites) {
            return res.status(404).json({ error: "Favorites playlist not found." });
        }

        await prisma.playlist.update({
            where: { id: favorites.id },
            data: { shows: { disconnect: { id: showId } } },
        });

        return res.status(200).json({ message: "Show removed from favorites." });
    } catch (error) {
        console.error("Error removing favorite:", error);
        return res.status(500).json({ error: "Failed to remove favorite." });
    }
});


// GET /playlists/:userId
// Fetches all playlists for a given user (including Favorites)

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter." });
        }

        const playlists = await prisma.playlist.findMany({
            where: { ownerId: userId },
            include: { shows: true },
        });

        if (!playlists || playlists.length === 0) {
            return res.status(200).json({ playlists: [], message: "No playlists found for user." });
        }

        return res.status(200).json({ playlists });
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return res.status(500).json({ error: "Failed to fetch playlists." });
    }
});


// POST /playlists/init
// Initialize user playlists (auto-create Favorites on first login)

router.post("/init", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId." });
        }

        // Check if Favorites already exist
        let favorites = await prisma.playlist.findFirst({
            where: { ownerId: userId, isFavorite: true },
        });

        // Create if not found
        if (!favorites) {
            favorites = await prisma.playlist.create({
                data: {
                    name: "Favorites",
                    isFavorite: true,
                    isPublic: false,
                    ownerId: userId,
                },
            });
        }

        res.status(200).json({
            message: "User playlists initialized successfully.",
            favorites,
        });
    } catch (error) {
        console.error("Error initializing playlists:", error);
        res.status(500).json({ error: "Failed to initialize playlists." });
    }
});


export default router;