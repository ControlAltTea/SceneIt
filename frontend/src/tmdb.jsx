const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchTrendingTV() {
  const url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_KEY}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}
