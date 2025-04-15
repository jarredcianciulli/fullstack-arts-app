import { useContext } from "react";
import { motion } from "framer-motion";
import { FormContext } from "../pages/Home";

const AnimatedHomeButtonSubmitProp = ({ link }) => {
  const { submitStepHomeMessage } = useContext(FormContext);

  return (
    <motion.button
      key="submitButton"
      onClick={(e) => {
        e.preventDefault();
        submitStepHomeMessage();
      }}
      initial={{ opacity: 0, position: "absolute" }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
        position: "relative",
      }}
      exit={{ opacity: 0, position: "absolute" }}
    >
      Send
      {/* <motion.svg
        initial={{ opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.25,
          },
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        /> */}
      <motion.svg
        width="27.5px"
        height="27.5px"
        animate={{
          marginLeft: ".55rem",
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M20 4L3 11L10 14L13 21L20 4Z"
          stroke="rgb(96, 96, 63, .75)"
        />
      </motion.svg>
    </motion.button>
  );
};

export default AnimatedHomeButtonSubmitProp;
