import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FormContext } from "../pages/Home";

const AnimatedHomeButtonSubmitSuccessProp = ({ link }) => {
  const { nextStepHomeMessage } = useContext(FormContext);

  return (
    <motion.button
      key="successButton"
      onClick={(e) => {
        e.preventDefault();
        nextStepHomeMessage(e);
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 2,
        },
        pointerEvents: "none",
      }}
      transition={{
        duration: 2,
      }}
    >
      Submitted
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          margin: "0 0 0 .55rem",
          transition: {
            duration: 1,
          },
        }}
        exit={{ opacity: 0 }}
        width="27.5px"
        height="27.5px"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"
          initial={{
            rotate: -180,
            opacity: 0,
            pathLength: 0,
            fill: "#231815",
          }}
          animate={{
            opacity: 1,
            pathLength: 1,
            rotate: 0,
            fill: "rgba(121, 207, 101, 0.726)",

            transition: {
              duration: 1.5,
              ease: "linear",
            },
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          initial={{
            opacity: 0,
            pathLength: 0,
            fill: "#231815",
          }}
          animate={{
            opacity: 1,
            pathLength: 1,
            fill: "rgba(121, 207, 101, 0.726)",

            transition: {
              duration: 1.2,
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
          exit={{ opacity: 0 }}
          d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z"
        />
      </motion.svg>
    </motion.button>
  );
};

export default AnimatedHomeButtonSubmitSuccessProp;
