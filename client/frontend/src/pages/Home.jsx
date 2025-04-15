import React, { useState, useRef, useEffect } from "react";

import Avatar1 from "../pages/assets/full_icon_adjacent.svg";
import Avatar2 from "../pages/assets/full_icon_adjacent_phone.png";
import Avatar3 from "../pages/assets/fatih-kgqu_qs3B78-unsplash.jpg";
import Avatar4 from "../pages/assets/jene-stephaniuk--MCrF6hnojU-unsplash.jpg";
import Avatar5 from "../pages/assets/katrina-wright-yMg_SMqfoRU-unsplash.jpg";
import Avatar6 from "../pages/assets/khadeeja-yasser-FHT0KEOwtyg-unsplash.jpg";
import Avatar7 from "../pages/assets/chooseyou_img_2.png";
import Avatar8 from "../pages/assets/doing_my_best.jpg";
import Avatar9 from "../pages/assets/pregnant_belly.jpg";
import Avatar10 from "../pages/assets/happy balloons.jpg";
import Avatar11 from "../pages/assets/painted hand.jpg";
import { ReactComponent as Logo } from "./assets/chooseyou-mission-img.svg";
import classes from "./Home.module.css";
import Principles from "../components/Principles";
import MissionStatement from "../components/MissionStatement";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
// import PageContent from "../components/PageContent";

function HomePage() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  );
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1000px)");
    const handleChange = (e) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const modalSetting = () => {
    setShowAboutModal(!showAboutModal);

    if (showAboutModal == false) {
      showOverlay();
    } else {
      removeOverlay();
    }
  };

  function showOverlay() {
    const mainEl = document.querySelector("html");
    mainEl.style.overflow = "hidden";
  }

  function removeOverlay() {
    const mainEl = document.querySelector("html");
    mainEl.style.overflow = "auto";
  }
  const transition_text = {
    duration: 0.33,
    ease: "easeInOut",
  };
  return (
    <motion.div className={classes.homeBody}>
      <Header />
      <div className={classes.logoContainer}>
        {/* {matches ? (
          <img className={classes.logo} src={Avatar1} />
        ) : (
          <img className={classes.logo} src={Avatar2} />
        )} */}
      </div>
      <Principles />
      <MissionStatement />
    </motion.div>
  );
}

export default HomePage;
