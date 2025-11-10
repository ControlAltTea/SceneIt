import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";

export default function SearchSidebar({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch TMDB search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
              accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("TMDB fetch failed");

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Error fetching TMDB data:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 500); // debounce search
    return () => clearTimeout(delay);
  }, [query]);

  // Handle adding a favorite
  const handleAddFavorite = async (media) => {
    try {
      const res = await fetch("http://localhost:8000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Chris", // or use currentUser.username if auth is set up
          mediaTmdbId: media.id,
        }),
      });

      const data = await res.json();
      if (res.ok) console.log("Added to favorites:", data);
      else console.error("Error:", data);
    } catch (err) {
      console.error("Failed to add favorite:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed top-0 right-0 w-[400px] h-full bg-gray-900 text-white shadow-2xl z-50 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search movies or shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg p-2 outline-none"
            />
            <button
              onClick={onClose}
              className="ml-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : results.length > 0 ? (
              results.map((media) => (
                <motion.div
                  key={media.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-xl shadow-md flex items-center space-x-4 p-3"
                >
                  <img
                    src={
                      media.poster_path
                        ? `https://image.tmdb.org/t/p/w200${media.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={media.title || media.name}
                    className="w-16 h-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {media.title || media.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {media.overview || "No description available."}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddFavorite(media)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Add to Favorites"
                  >
                    <Heart size={22} />
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                {query ? "No results found." : "Start typing to search."}
              </p>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
