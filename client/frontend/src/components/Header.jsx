import classes from "./Header.module.css";
import Avatar1 from "./assets/exercise.svg";
import Avatar2 from "./assets/bed.svg";
import Avatar3 from "./assets/meditations.svg";
import Avatar4 from "./assets/healthy.svg";
import Avatar5 from "./assets/bracket.svg";

import React, { useState, useRef, useEffect } from "react";

import Avatar6 from "./assets/full_icon_adjacent_phone.png";
import Avatar7 from "./assets/full_icon_adjacent_phone.png";
import Avatar8 from "./assets/bracketRight.svg";

import BookingSignupCTA from "./BookingSignupCTA";

function Header() {
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
  return (
    <div className={classes.headerBody}>
      <section className={classes.headerSection}>
        {matches ? (
          <img className={classes.logo} src={Avatar6} />
        ) : (
          <img className={classes.logo} src={Avatar7} />
        )}
        <h1>Nutrition, Wellness and Longevity Consulting</h1>
        <div className={classes.headerTaglineSection}>
          <img className={classes.headerQuote} src={Avatar5} />

          <p className={classes.headerTagline}>
            Optimize your health through nutrition, exercise, sleep and stress
            management strategies
          </p>
          <img className={classes.headerQuoteRight} src={Avatar8} />
        </div>
        <p className={classes.headerSectionCTAP}>
          Ready to start your journey?
        </p>

        <BookingSignupCTA />
      </section>
    </div>
  );
}

export default Header;
