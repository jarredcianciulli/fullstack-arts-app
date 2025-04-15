import classes from "./Home.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <motion.div className={classes.main}>Home</motion.div>
    </>
  );
}
