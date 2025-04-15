import React from "react";
import { motion } from "framer-motion";

const AnimatedHeaderTextProp = ({ text }) => {
  return (
    <motion.div
      fontSize="inherit"
      initial={{ opacity: 0, x: -900 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          duration: 2.25,
        },
      }}
    >
      {text}
    </motion.div>
  );
};

export default AnimatedHeaderTextProp;
