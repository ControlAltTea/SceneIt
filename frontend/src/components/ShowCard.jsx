// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
// const API_KEY =  import.meta.env.VITE_TMDB_API_KEY;
// const ShowCard = ({ show }) => {
//   const navigate = useNavigate();
//   const [hovered, setHovered] = useState(false);
//   const [details, setDetails] = useState(null);

//   useEffect(() => {
//     // Fetch full details for each show
//     const fetchDetails = async () => {
//       try {
//         const res = await fetch(
//           `https://api.themoviedb.org/3/tv/${show.id}?api_key=${API_KEY}&language=en-US`
//         );
//         const data = await res.json();
//         setDetails(data);
//       } catch (err) {
//         console.error("Error fetching show details:", err);
//       }
//     };

//     fetchDetails();
//   }, [show.id]);

//   return (
//     <div
//       onClick={() => navigate(`/show/${show.id}`)}
//       className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 w-full h-full"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {show.poster_path ? (
//         <img
//           src={`${IMAGE_BASE}${show.poster_path}`}
//           alt={show.name}
//           className={`w-full h-full object-cover transition-opacity duration-300 ${
//             hovered ? "opacity-50" : "opacity-100"
//           }`}
//         />
//       ) : (
//         <div className="w-full h-full bg-gray-600 flex items-center justify-center">
//           No Image
//         </div>
//       )}

//       {/* Overlay on hover */}
//       {hovered && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2 bg-black bg-opacity-50">
//           <h2 className="text-lg font-bold">{show.name}</h2>
//           <p>{show.vote_average ? `⭐ ${show.vote_average.toFixed(1)}` : "No rating"}</p>
//           <p>
//             Seasons:{" "}
//             {details?.number_of_seasons !== undefined
//               ? details.number_of_seasons
//               : "?"}
//           </p>
//           <p>
//             Episodes:{" "}
//             {details?.number_of_episodes !== undefined
//               ? details.number_of_episodes
//               : "?"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowCard;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// const ShowCard = ({ show }) => {
//   const navigate = useNavigate();
//   const [hovered, setHovered] = useState(false);

//   const title = show.name || show.title || "Untitled";
//   const poster = show.poster_path;
//   const rating = show.vote_average;

//   const imageUrl = poster
//     ? `${IMAGE_BASE}${poster}`
//     : "https://via.placeholder.com/300x450?text=No+Image";

//   return (
//     <div
//       onClick={() => navigate(`/show/${show.id}`)}
//       className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 w-full h-full"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <img
//         src={imageUrl}
//         alt={title}
//         className={`w-full h-full object-cover transition-opacity duration-300 ${
//           hovered ? "opacity-50" : "opacity-100"
//         }`}
//       />

//       {hovered && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2 bg-black bg-opacity-50">
//           <h2 className="text-lg font-bold">{title}</h2>
//           <p>{rating ? `⭐ ${rating.toFixed(1)}` : "No rating"}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const ShowCard = ({ show }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // TMDB data
  const title = show.name || show.title || "Untitled";
  const poster = show.poster_path;
  const rating = show.vote_average;

  // Fallback when no poster exists
  const imageUrl = poster
    ? `${IMAGE_BASE}${poster}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg bg-black/40 cursor-pointer 
                 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={() => navigate(`/show/${show.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <img
        src={imageUrl}
        alt={title}
        className={`w-full h-full object-cover transition duration-300 ${
          hovered ? "opacity-40" : "opacity-100"
        }`}
      />

      {/* Hover Overlay */}
      {hovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center 
                        text-center px-4 bg-black/60 backdrop-blur-sm transition duration-300">

          <h2 className="text-lg font-semibold text-white drop-shadow-md">
            {title}
          </h2>

          <p className="mt-2 text-yellow-300 font-medium">
            {rating ? `⭐ ${rating.toFixed(1)}` : "No rating"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowCard;

