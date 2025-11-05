import React, { useEffect, useState } from "react";
import ShowCard from "./ShowCard";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
// const API_BASE = "https://api.themoviedb.org/3";
// const USE_V4 = !!import.meta.env.VITE_TMDB_TOKEN;     // prefer v4 if provided
// const V3_KEY = import.meta.env.VITE_TMDB_API_KEY;         // fallback v3 key
// const V4_TOKEN = import.meta.env.VITE_TMDB_TOKEN;     // bearer


const API_KEY = "0682a4928132745b1b008a4f2d1c6d53"; 
//use different end point for "Featured"
//https://api.themoviedb.org/3/movie/popular?language=en-US&page=1
// const TRENDING_URL = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;
//1. Make sure token is being called from the .env file
//2. Change title to popular shows not Airing today 
// let TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjgyYTQ5MjgxMzI3NDViMWIwMDhhNGYyZDFjNmQ1MyIsIm5iZiI6MTc2MjAyMTg1My42MjMwMDAxLCJzdWIiOiI2OTA2NTFkZGYwZGZmM2MzNTcyZmU1ZWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4YDoTffsXxjtA3-Ni_5iSUbi9Os0-jseUwenle8kmL4"

export default function FeaturedShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function fetchAiringToday() {
      try {
        if (!TMDB_TOKEN) throw new Error("Missing VITE_TMDB_TOKEN in .env");
        const res = await fetch(   `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`, {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch shows (${res.status})`);
        const data = await res.json();
        setShows(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Error fetching shows:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAiringToday();
  }, []);

  const handlePrev = () => setCurrentIndex((i) => Math.max(i - ITEMS_PER_PAGE, 0));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(i + ITEMS_PER_PAGE, Math.max(0, shows.length - ITEMS_PER_PAGE)));

  if (loading) return <div className="text-white text-center mt-10">Loading…</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="bg-primary pb-10">
      <div className="w-full max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
          Popular Shows
        </h2>
        <div className="h-[2px] bg-white w-3/4 mx-auto mt-2 mb-6" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-6">
        <button
          className="transform rotate-180 p-3 rounded-full text-white hover:text-secondary disabled:opacity-40"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ➤
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {shows.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((show) => (
            <div key={show.id} className="flex-shrink-0 w-40 sm:w-44 h-[20rem] mx-auto">
              <ShowCard show={show} />
            </div>
          ))}
        </div>

        <button
          className="p-3 rounded-full text-white hover:text-secondary disabled:opacity-40"
          onClick={handleNext}
          disabled={currentIndex >= Math.max(0, shows.length - ITEMS_PER_PAGE)}
        >
          ➤
        </button>
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import ShowCard from "./ShowCard";

// const API_BASE = "https://api.themoviedb.org/3";
// const USE_V4 = !!import.meta.env.VITE_TMDB_TOKEN;     // prefer v4 if provided
// const V3_KEY = import.meta.env.VITE_TMDB_API_KEY;         // fallback v3 key
// const V4_TOKEN = import.meta.env.VITE_TMDB_TOKEN;     // bearer

// export default function FeaturedShows() {
//   const [shows, setShows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const ITEMS_PER_PAGE = 5;

//   useEffect(() => {
//     async function fetchAiringToday() {
//       setLoading(true);
//       setError("");
//       try {
//         const url = `${API_BASE}/tv/airing_today?language=en-US&page=1`;

//         const res = await fetch(
//           USE_V4 ? url : `${url}&api_key=${encodeURIComponent(V3_KEY || "")}`,
//           USE_V4
//             ? {
//                 headers: {
//                   accept: "application/json",
//                   Authorization: `Bearer ${V4_TOKEN}`,
//                 },
//               }
//             : undefined
//         );

//         if (!res.ok) {
//           throw new Error(`TMDB request failed (${res.status})`);
//         }

//         const data = await res.json();
//         const items = Array.isArray(data.results) ? data.results : [];
//         setShows(items);

//         // quick debug if empty
//         if (items.length === 0) {
//           console.log("Airing Today returned 0 results. Raw payload:", data);
//         }
//       } catch (e) {
//         console.error(e);
//         setError(e.message || "Failed to fetch featured shows");
//       } finally {
//         setLoading(false);
//       }
//     }

//     // sanity checks
//     if (!USE_V4 && !V3_KEY) {
//       setLoading(false);
//       setError("Missing TMDB credentials. Set VITE_TMDB_KEY or VITE_TMDB_TOKEN.");
//       return;
//     }

//     fetchAiringToday();
//   }, []);

//   const handlePrev = () => setCurrentIndex((i) => Math.max(i - ITEMS_PER_PAGE, 0));
//   const handleNext = () =>
//     setCurrentIndex((i) => Math.min(i + ITEMS_PER_PAGE, Math.max(0, shows.length - ITEMS_PER_PAGE)));

//   if (loading) return <div className="text-white text-center mt-10">Loading…</div>;
//   if (error)   return <div className="text-red-500 text-center mt-10">{error}</div>;
//   if (shows.length === 0) return <div className="text-gray-300 text-center mt-10">No featured shows found.</div>;

//   return (
//     <div className="bg-primary pb-10">
//       {/* Title */}
//       <div className="w-full max-w-6xl mx-auto text-center">
//         <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">Featured: Airing Today</h2>
//         <div className="h-[2px] bg-white w-3/4 mx-auto mt-2 mb-6" />
//       </div>

//       {/* Carousel */}
//       <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-6">
//         {/* Left Arrow */}
//         <button
//           className="transform rotate-180 p-3 rounded-full text-white hover:text-secondary disabled:opacity-40"
//           onClick={handlePrev}
//           disabled={currentIndex === 0}
//           aria-label="Previous"
//         >
//           ➤
//         </button>

//         {/* Show Grid (5 at a time) */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//           {shows.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((show) => (
//             <div key={show.id} className="flex-shrink-0 w-40 sm:w-44 h-[20rem] mx-auto">
//               <ShowCard show={show} />
//             </div>
//           ))}
//         </div>

//         {/* Right Arrow */}
//         <button
//           className="p-3 rounded-full text-white hover:text-secondary disabled:opacity-40"
//           onClick={handleNext}
//           disabled={currentIndex >= Math.max(0, shows.length - ITEMS_PER_PAGE)}
//           aria-label="Next"
//         >
//           ➤
//         </button>
//       </div>
//     </div>
//   );
// }
