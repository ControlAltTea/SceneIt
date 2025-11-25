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

/// Create new custom playlist (will add custom naming later)
router.post("/", async (req, res) => {
  try {
    const { ownerUsername, name, isPublic = true } = req.body;
    if (!ownerUsername || !name)
      return res.status(400).json({ error: "Missing ownerUsername or name." });

    /// Prevent users from naming a playlist if its the “Favorites” playlist
    if (name.toLowerCase() === "favorites") {
      await ensureFavorites(ownerUsername);
      return res.status(400).json({ error: "Favorites playlist already exists." });
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


/// Adds or removes a show from user's favorites 
router.post("/favorites/toggle", async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const username = req.user.username;

    const favorites = await ensureFavorites(username);

    /// to chekc if the media is already in the playlist
    const existing = await prisma.playlistMedia.findFirst({
      where: {
        playlistId: favorites.id,
        mediaTmdbId: tmdbId,
      },
    });

    if (existing) {
      /// Remove from favorites
      await prisma.playlistMedia.delete({
        where: { id: existing.id },
      });

      return res.json({ success: true, favorited: false });
    }

    // Add to favorites
    await prisma.playlistMedia.create({
      data: {
        playlistId: favorites.id,
        mediaTmdbId: tmdbId,
      },
    });

    return res.json({ success: true, favorited: true });
  } catch (error) {
    console.error("Favorite toggle error:", error);
    res.status(500).json({ error: "Failed to change favorite" });
  }
});


/// finds and retrieves user's favorites
router.get("/favorites", async (req, res) => {
  try {
    const username = req.user.username;

    const favorites = await prisma.playlist.findFirst({
      where: { ownerUsername: username, isFavorite: true },
      include: {
        playlistMedia: {
          include: { media: true },
        },
      },
    });

    return res.json(favorites || { playlistMedia: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load favorites" });
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
      where: { ownerUsername: username },
      include: { playlistMedia: { include: { media: true } } },
    });

    res.json(
      playlists.map((p) => ({
        id: p.id,
        name: p.name,
        isFavorite: p.isFavorite,
        media: p.playlistMedia.map((pm) => pm.media),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlists." });
  }
});

/// Get single playlist by ID
router.get("/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: Number(playlistId) },
      include: { playlistMedia: { include: { media: true } } },
    });

    if (!playlist) return res.status(404).json({ error: "Playlist not found." });
    res.json({
      id: playlist.id,
      name: playlist.name,
      isFavorite: playlist.isFavorite,
      media: playlist.playlistMedia.map((pm) => pm.media),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlist." });
  }
});

export default router;
