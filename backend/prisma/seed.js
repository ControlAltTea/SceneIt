import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the database...');

    // Add shows to database
    const shows = await prisma.show.createMany({
        data: [
            {
                id: 1,
                title: "Breaking Bad",
                posterUrl: "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg",
            },
            {
                id: 2,
                title: "The Witcher",
                posterUrl: "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg",
            },
            {
                id: 3,
                title: "Rick & Morty",
                posterUrl: "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg",
            },
            {
                id: 4,
                title: "Avengers Assemble",
                posterUrl: "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
            },
        ],
        skipDuplicates: true,
    });

    console.log('Seeded shows successfully.');

    // Create a test user and favorite
    const userId = 'user123';

    await prisma.favorite.create({
        data: {
            userId,
            show: { connect: { id: 1 } },
        },
    });

    console.log(`Example favorite created for user: ${userId}`);
}

main()
    .then(() => console.log("Seeding completed successfully!"))
    .catch((err) => {
        console.error("Error during seeding:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
