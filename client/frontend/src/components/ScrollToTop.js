import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Pathname changed:", location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]); // Reacts to both pathname and search changes

  return null;
};

export default ScrollToTop;
