import classes from "./BookingSignupCTA.module.css";
import React, { useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import { PopupButton } from "react-calendly";
import { NavContext } from "./NavContext";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const BookingSignup = (props) => {
  const { showNav, setShowNav, navMenu } = useContext(NavContext);
  const navMenu1 = () => {
    console.log(showNav);
    setShowNav(false);
  };
  return (
    <AnimatePresence>
      <motion.div className="App">
        <PopupButton
          className={classes.button}
          url="https://calendly.com/optimavitallc/test"
          /*
           * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
           * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
           */
          rootElement={document.getElementById("root")}
          text="Book your Free Consultation"
        />
      </motion.div>
    </AnimatePresence>
  );
};

// function BookingSignup() {
//   return (
//     <div>
//       <button className={classes.button}>Book an appointment</button>
//     </div>
//   );
// }

export default BookingSignup;
