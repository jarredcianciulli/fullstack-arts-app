import { useContext } from "react";
import { motion } from "framer-motion";
import classes from "./AnimatedHeaderTextProp.module.css";
import { FormContext } from "../pages/Home";

const AnimatedTextAreaProp = ({ text, changeHandler, value }) => {
  const { setShowFormInputValid } = useContext(FormContext);

  return (
    <motion.textarea
      className={classes.animatedTextArea}
      cols="60"
      rows="5"
      key="textAreaInput"
      placeholder={text}
      initial={{
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      exit={{
        opacity: 0,
        position: "absolute",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      value={value}
      onChange={changeHandler}
    ></motion.textarea>
  );
};

export default AnimatedTextAreaProp;
