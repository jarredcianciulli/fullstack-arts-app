import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import { NavLink } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import Sidebar from "../components/Sidebar";
// import NavProvider from "../components/NavContext";
import Footer from "../components/Footer";
import classes from "./RootUnauth.module.css";
import ScrollToTop from "../components/ScrollToTop";
// import { getTokenDuration } from "../util/auth";
import Avatar1 from "../components/assets/logo_company_adjacent.png";
import { motion, useScroll, AnimatePresence } from "framer-motion";

function RootUnauth() {
  console.log("shoh");
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  //   const token = useLoaderData();
  //   const submit = useSubmit();
  //   useEffect(() => {
  //     if (!token) {
  //       return;
  //     }
  //     if (token === "EXPIRED") {
  //       submit(null, { action: "/logout", method: "post" });
  //       return;
  //     }
  //     const tokenDuration = getTokenDuration();
  //     console.log(tokenDuration);
  //     setTimeout(() => {
  //       submit(null, { action: "/logout", method: "post" });
  //     }, tokenDuration);
  //   }, [token, submit]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={transition_text}
        exit={{ opacity: 0 }}
      >
        <ScrollToTop />
        <div className={classes.logoContainer}>
          <NavLink to="https://optimavitaconsulting.com">
            <img className={classes.logo} src={Avatar1} />
          </NavLink>
        </div>
        <div className={classes.body}>
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RootUnauth;
