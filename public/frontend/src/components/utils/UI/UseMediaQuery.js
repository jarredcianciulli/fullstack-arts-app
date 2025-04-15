import { useEffect, useState } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleMediaChange = (e) => setMatches(e.matches);

    // Set initial state
    setMatches(mediaQuery.matches);

    // Add event listener
    mediaQuery.addEventListener("change", handleMediaChange);

    // Clean up event listener on unmount
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
