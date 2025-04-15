import React, { useState, useEffect } from "react";
import classes from "./CookieBanner.module.css";
import { motion, AnimatePresence } from "framer-motion";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={classes.cookieBanner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className={classes.message}>
            We use cookies to enhance your experience. By continuing, you agree
            to our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
          <div className={classes.actions}>
            <button className={classes.accept} onClick={handleAccept}>
              Accept
            </button>
            <button className={classes.decline} onClick={handleDecline}>
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
