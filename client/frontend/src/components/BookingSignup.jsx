import React, { useState, useContext, useEffect, useRef } from "react";
import { PopupButton } from "react-calendly";
import { NavContext } from "./NavContext";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./BookingSignup.module.css";

const BookingSignup = () => {
  const { showNav, setShowNav } = useContext(NavContext);
  const rootRef = useRef(null);

  useEffect(() => {
    rootRef.current = document.getElementById("root");
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="App"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {rootRef.current && (
          <PopupButton
            className={classes.button}
            url="https://calendly.com/optimavitallc/test"
            rootElement={rootRef.current}
            text="Consultation"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingSignup;
