import { motion } from "framer-motion";
import classes from "./AnimatedHomeEmailInputProp.module.css";

const AnimatedHomeEmailInputProp = ({ value, onChangeTextareaHandler }) => {
  return (
    <motion.input
      className={classes.homeInputFieldEmailField}
      key="email"
      placeholder="Enter your email"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        letterSpacing: "3px",
        transition: {
          //   duration: 0.3,
          //   delay: 0.5,
        },
      }}
      exit={{
        opacity: 0,
        position: "absolute",
      }}
      onChange={onChangeTextareaHandler}
      value={value}
    ></motion.input>
  );
};

export default AnimatedHomeEmailInputProp;
