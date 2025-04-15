import React from "react";
import { motion } from "framer-motion";
import classes from "./AnimatedTextWord.module.css";

const AnimatedTextWord = ({ text }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
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
      x: 20,
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
      fontSize="inherit"
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          fontSize="inherit"
          variants={child}
          style={{ marginRight: "5px" }}
          key={index}
          exit={{
            opacity: 0,
          }}
          transition={{
            delay: index * 0.3,
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedTextWord;
