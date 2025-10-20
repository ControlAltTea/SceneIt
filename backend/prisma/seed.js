import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Users to seed
  const sampleData = [
    { email: "chrisHouse@example.com", username: "Chris", password: "password123" },
    { email: "merlingV@example.com", username: "Merling", password: "password123" },
    { email: "KarlaL@example.com", username: "Karla", password: "password123" },
    { email: "RafiqS@example.com", username: "Rafiq", password: "password123" },
];

  // Sample shows
  const showsData = [
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
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      releaseYear: 2010,
      producer: "Christopher Nolan",
    },
  ];

  for (const data of sampleData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });

    console.log("User seeded:", user.email);

    const favorites = await prisma.playlist.upsert({
      where: {
        name_ownerId: {
          name: "Favorites",
          ownerId: user.id,
        },
      },
      update: {},
      create: {
        name: "Favorites",
        isFavorite: true,
        isPublic: false,
        ownerId: user.id,
      },
    });

    console.log("Favorites playlist created for:", user.email);

    for (const showData of showsData) {
      const show = await prisma.show.upsert({
        where: { tmdbId: showData.tmdbId },
        update: {},
        create: showData,
      });

      const alreadyConnected = await prisma.playlistShow.findFirst({
        where: { playlistId: favorites.id, showId: show.id },
      });

      if (!alreadyConnected) {
        await prisma.playlistShow.create({
          data: { playlistId: favorites.id, showId: show.id },
        });
      }

      console.log(`Show '${show.title}' added to ${user.username}'s Favorites playlist.`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
