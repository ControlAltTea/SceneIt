import { useState, useEffect } from "react";
import axios from 'axios';
import { motion } from "motion/react";
import { Search, X, Heart } from "lucide-react";


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Scroll threshold for header style
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 8;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 
  const searchMovies = async (query) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        accept: 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch TMDB results');
    }
  
    const data = await response.json();
    return data.results;
  };
  
  // Connects to backend and pushes "favorited" media to backend
  const handleAddToFavorites = async (media) => {
    try {
      const payload = {
        username: "Chris", // or dynamically from user context/auth later
        mediaTmdbId: media.id,
      };
  
      const res = await axios.post("http://localhost:8080/favorites", payload);
      console.log("Added to favorites:", res.data);
      alert(`${media.title} has been added to your favorites ❤️`);
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert("Failed to add to favorites. Please try again.");
    }
  };

  return (
    <>
      <header
        id="header"
        className={`fixed top-0 left-0 right-0 z-50 transition-[width,margin,padding,transform,background-color,border-radius] duration-700 ease-in-out ${isScrolled
            ? "w-[92%] bg-[#05000c] text-gray-100 mt-7 px-10 py-6 bg-inherit shadow-[0px_0px_18px_2px_rgba(255,255,255,0.5)] rounded-2xl mx-auto"
            : "w-full backdrop-blur-sm text-gray-900 py-8 px-20 bg-transparent"
          }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-4xl font-bold text-gray-700 dark:text-white cursor-pointer flex items-center gap-2">
            <img src="/sceneit.png" width={35} alt="SceneIt" />
            <span>SceneIt</span>
          </div>

          {/* Nav */}
          <nav
            className={`${isScrolled
                ? "text-gray-200 dark:text-gray-300"
                : "text-gray-700 dark:text-gray-200"
              }`}
          >
            <ul className="flex space-x-8 items-center text-gray-700 dark:text-gray-300 transition-all duration-200">
              <li>
                <a className="font-semibold text-lg cursor-pointer hover:underline">
                  Log In
                </a>
              </li>
              <li>
                <a className="font-semibold text-lg cursor-pointer hover:underline">
                  Create an Account
                </a>
              </li>
              <li>
                <a className="font-semibold text-lg cursor-pointer hover:underline">
                  Shows
                </a>
              </li>
              <li>
                <a className="font-semibold text-lg cursor-pointer hover:underline">
                  Playlist
                </a>
              </li>
              {/* Search Input */}
              <li>
                <form onSubmit={searchMovies} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.5 }}
        className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-lg z-50 flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {searchResults.length > 0 ? (
            searchResults.map((media) => (
              <div
                key={media.id}
                className="flex items-center p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <img
                  src={media.poster}
                  alt={media.title}
                  className="w-12 h-16 rounded object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold">{media.title}</p>
                  <p className="text-xs text-gray-400">{media.year}</p>
                </div>
                <button
                  onClick={() => handleAddToFavorites(media)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-red-600 transition"
                >
                  <Heart size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm p-4">No results yet.</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
