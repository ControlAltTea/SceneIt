import { useState } from "react";
import HeartIcon from "./HeartIcon";

export default function FavoriteHeart({ tmdbId, initialFavorited = false, size = 24, color = "#FF0000" }) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const toggleFavorite = async () => {
    const updated = !isFavorited;
    setIsFavorited(updated);


    /// fetches user's favorites
    try {
      await fetch("/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ showId: tmdbId }),
      });
    } catch (err) {
      console.error("Error updating favorite:", err);
      setIsFavorited(!updated);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-3 right-3 z-20 p-2 
                 rounded-full bg-black/50 backdrop-blur 
                 hover:bg-black/70 transition-colors"
    >
      <HeartIcon filled={isFavorited} size={size} color={color} />
    </button>
  );
}
