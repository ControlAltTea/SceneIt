// backend/src/utils/buildShowWhere.js

// Optional: keep this in sync with your Prisma enum if you want validation
const ALLOWED_GENRES = new Set([
    "ACTION",
    "COMEDY",
    "DRAMA",
    "FANTASY",
    "HORROR",
    "ROMANCE",
    "SCIFI",
    "THRILLER",
    "ANIMATION",
  ]);
  
//   function parseYear(year) {
//     if (year == null || year === "") return null;
//     const y = Number(year);
//     return Number.isInteger(y) ? y : null;
//   }
  
//   function normalizeGenres(genre) {
//     if (!genre) return [];
//     return String(genre)
//       .split(",")
//       .map((g) => g.trim().toUpperCase())
//       .filter((g) => g && (ALLOWED_GENRES.size ? ALLOWED_GENRES.has(g) : true));
//   }
  
//   function isTrueFlag(value) {
//     // accept true, "true", "TRUE", etc.
//     return String(value).toLowerCase() === "true";
//   }
// export function buildShowWhere({
//     q,
//     genre,
//     year,
//     username,
//     inPublicPlaylists,
//   }) {
//     const AND = [];
  
//     // Free-text search
//     const qTrim = (q ?? '').trim();
//     if (qTrim) {
//       AND.push({
//         OR: [
//           { title: { contains: qTrim, mode: 'insensitive' } },
//           { description: { contains: qTrim, mode: 'insensitive' } },
//         ],
//       });
//     }
  
//     // Genre (support single or comma-separated)
//     if (genre) {
//       const genres = String(genre)
//         .split(',')
//         .map((g) => g.trim().toUpperCase())
//         .filter(Boolean);
  
//       if (genres.length > 0) {
//         AND.push({
//           genre: { in: genres }, // or { equals: genres[0] } if only one allowed
//         });
//       }
//     }
  
//     // Year
//     if (year) {
//       const y = Number(year);
//       if (Number.isInteger(y)) {
//         AND.push({ year: y });
//       }
//     }
  
//     // Username (creator of the show)
//     if (username) {
//       const u = String(username).trim();
//       if (u) {
//         AND.push({
//           createdBy: {
//             username: { contains: u, mode: 'insensitive' },
//           },
//         });
//       }
//     }
  
//     // Show appears in at least one public playlist
//     if (inPublicPlaylists === 'true') {
//       AND.push({
//         playlists: {
//           some: {
//             isPublic: true,
//           },
//         },
//       });
//     }
  
//     if (AND.length === 0) return {}; // no filters → full set
//     return { AND };
//   }
  
export function buildShowWhere({ q, genre, year }) {
  const AND = [];

  // Free-text search: title / description
  const qTrim = (q ?? "").trim();
  if (qTrim) {
    AND.push({
      OR: [
        { title: { contains: qTrim, mode: "insensitive" } },
        { description: { contains: qTrim, mode: "insensitive" } },
      ],
    });
  }

  // Genre (simple string field)
  if (genre && genre !== "ALL") {
    const g = String(genre).trim();
    if (g) {
      AND.push({
        // Show.genre is optional String? in your schema
        genre: {
          equals: g,
          mode: "insensitive",
        },
      });
    }
  }

  // Year → maps to Show.release_year
  if (year) {
    const y = Number(year);
    if (Number.isInteger(y)) {
      AND.push({ release_year: y });
    }
  }

  // If no filters, return empty where → full set
  if (AND.length === 0) return {};
  return { AND };
}