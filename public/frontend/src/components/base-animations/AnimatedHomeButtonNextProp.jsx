import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FormContext } from "../pages/Home";

const AnimatedHomeButtonNextProp = ({ link }) => {
  const { nextStepHomeMessage } = useContext(FormContext);

  return (
    <motion.button
      key="nextButton"
      onClick={(e) => {
        e.preventDefault();
        nextStepHomeMessage(e);
      }}
      initial={{
        opacity: 0,
        position: "absolute",
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
        },
        position: "relative",
      }}
      exit={{
        opacity: 0,
        position: "absolute",
      }}
    >
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M4 12H20M20 12L16 8M20 12L16 16"
          stroke="rgb(96, 96, 63, .75)"
        />
      </motion.svg>
    </motion.button>
  );
};

export default AnimatedHomeButtonNextProp;
