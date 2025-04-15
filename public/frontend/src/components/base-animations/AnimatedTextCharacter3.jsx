import React from "react";
import { motion } from "framer-motion";
import classes from "./AnimatedTextCharacter.module.css";

const AnimatedTextCharacter3 = ({ text }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 1 * i,
      },
      display: "flex",
      width: "500px",
      height: "500px",
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
      width: "fit-content",
      height: "fit-content",
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
      className={classes.header3}
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{
        opacity: 0,
      }}
      // transition={{
      //   type: "spring",
      //   stiffness: 100,
      //   damping: 12,
      //   duration: 1,
      // }}
    >
      {letters.map((letter, index) => (
        <motion.div className={classes.text3} variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedTextCharacter3;
