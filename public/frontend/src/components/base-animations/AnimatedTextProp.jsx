import React from "react";
import { motion } from "framer-motion";
import classes from "./AnimatedTextProp.module.css";

const AnimatedTextCharacter = ({ text }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 1 * i,
      },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={classes.header}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.div
          className={classes.text}
          variants={child}
          key={index}
          exit={{
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            duration: 1,
            delay: index * 0.05,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedTextCharacter;
