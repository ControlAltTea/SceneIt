useEffect(() => {
    if (!query) return;
  
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}&language=en-US&page=1`
        );
  
        if (!res.ok) {
          throw new Error("TMDB API request failed");
        }
  
        const data = await res.json();
        console.log("TMDB response:", data); 
        setResults(data.results || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [query]);
  