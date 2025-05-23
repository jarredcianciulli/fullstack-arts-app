import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import Footer from "../footer/Footer";
import classes from "./Root.module.css";

function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <>
      <Navigation />
      <div
        className={`${classes.body} ${isHome ? classes.homeBodyActive : ""}`}
        ref={contentRef}
      >
        <main>
          <Outlet />
        </main>
        {!isHome && <Footer />}
      </div>
    </>
  );
}

export default RootLayout;
