import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  /// Creating users to test routes with
  const sampleUsers = [
<<<<<<< HEAD
    { email: "chris@test.com", username: "chris", password: "password" },
    { email: "merling@test.com", username: "merling", password: "password" },
    { email: "karla@test.com", username: "karla", password: "password" },
    { email: "rafiq@test.com", username: "rafiq", password: "password" },
=======
    { email: "chrisHouse@example.com", username: "Chris", password: "password123" },
    { email: "merlingV@example.com", username: "Merling", password: "password123" },
    { email: "KarlaL@example.com", username: "Karla", password: "password123" },
    { email: "RafiqS@example.com", username: "Rafiq", password: "password123" },
>>>>>>> 408a45567b50bd69f65808f4be7b39a884eeaab2
  ];

  /// Sample movies
  const mediaData = [
    {
      tmdbId: 157336,
      title: "Interstellar",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg",
      releaseYear: 2014,
      producer: "Christopher Nolan",
    },
    {
      tmdbId: 27205,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      releaseYear: 2010,
      producer: "Christopher Nolan",
    },
  ];

  for (const userData of sampleUsers) {
    /// Upsert users to db
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`User seeded: ${user.username}`);

    /// Upsert favorite playlists for eery user
    const favorites = await prisma.playlist.upsert({
      where: { name_ownerUsername: { name: "Favorites", ownerUsername: user.username } },
      update: {},
      create: {
        name: "Favorites",
        isFavorite: true,
        isPublic: false,
        ownerUsername: user.username,
      },
    });
    console.log(`Favorites playlist created for: ${user.username}`);

    /// Upsert media & connect them to Favorites playlist
    for (const m of mediaData) {
      const media = await prisma.media.upsert({
        where: { tmdbId: m.tmdbId },
        update: {},
        create: m,
      });

      /// Connect media to playlist if not already connected
      const existingConnection = await prisma.playlistMedia.findUnique({
        where: {
          playlistName_ownerUsername_mediaTmdbId: {
            playlistName: favorites.name,
            ownerUsername: favorites.ownerUsername,
            mediaTmdbId: media.tmdbId,
          },
        },
      });

      if (!existingConnection) {
        await prisma.playlistMedia.create({
          data: {
            playlistName: favorites.name,
            ownerUsername: favorites.ownerUsername,
            mediaTmdbId: media.tmdbId,
          },
        });
        console.log(`'${media.title}' added to ${user.username}'s Favorites.`);
      }
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(async (error) => {
    console.error("Seed error:", error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
