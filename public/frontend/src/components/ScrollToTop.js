import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  console.log(location.search);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  return null;
};

export default ScrollToTop;
