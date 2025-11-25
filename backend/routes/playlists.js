import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/// confirms user’s Favorites playlist exists, then creates playlist if "favorite" doesn't exist
async function ensureFavorites(username) {
  let favorites = await prisma.playlist.findFirst({
    where: { ownerUsername: username, isFavorite: true },
  });

  if (!favorites) {
    favorites = await prisma.playlist.create({
      data: {
        name: "Favorites",
        isFavorite: true,
        isPublic: false,
        ownerUsername: username,
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
      data: { name, isPublic, ownerUsername },
    });

    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
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




/// Add media to custom playlist
router.post("/:playlistId/media", async (req, res) => {
  try {
    const { tmdbId, title, posterUrl } = req.body;
    const { playlistId } = req.params;

    if (!tmdbId || !title) {
      return res.status(400).json({ error: "Missing tmdbId or title." });
    }

    // Fetch playlist first
    const playlist = await prisma.playlist.findUnique({ where: { id: Number(playlistId) } });
    if (!playlist) return res.status(404).json({ error: "Playlist not found." });

    // Ensure media exists
    const media = await prisma.media.upsert({
      where: { tmdbId },
      update: {},
      create: { tmdbId, title, posterUrl: posterUrl || null },
    });

    /// Prevent duplicate entries 
    const exists = await prisma.playlistMedia.findUnique({
      where: {
        playlistName_ownerUsername_mediaTmdbId: {
          playlistName: playlist.name,
          ownerUsername: playlist.ownerUsername,
          mediaTmdbId: media.tmdbId,
        },
      },
    });

    if (exists) return res.json({ message: "Media already in playlist." });

    await prisma.playlistMedia.create({
      data: {
        playlistName: playlist.name,
        ownerUsername: playlist.ownerUsername,
        mediaTmdbId: media.tmdbId,
      },
    });

    const updated = await prisma.playlist.findUnique({
      where: { id: Number(playlistId) },
      include: { playlistMedia: { include: { media: true } } },
    });

    res.status(201).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add media." });
  }
});

/// Remove media from playlist
router.delete("/:playlistId/media/:tmdbId", async (req, res) => {
  try {
    const { playlistId, tmdbId } = req.params;

    const playlist = await prisma.playlist.findUnique({ where: { id: Number(playlistId) } });
    if (!playlist) return res.status(404).json({ error: "Playlist not found." });

    await prisma.playlistMedia.deleteMany({
      where: {
        playlistName: playlist.name,
        ownerUsername: playlist.ownerUsername,
        mediaTmdbId: Number(tmdbId),
      },
    });

    res.json({ message: "Media removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove media." });
  }
});

/// Get all playlists for a user
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    await ensureFavorites(username);

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

