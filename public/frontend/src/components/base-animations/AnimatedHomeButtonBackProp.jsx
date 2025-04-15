import { useContext } from "react";
import { motion } from "framer-motion";
import { FormContext } from "../pages/Home";

const AnimatedHomeButtonBackProp = ({ link }) => {
  const { backStepHomeMessage } = useContext(FormContext);

  return (
    <motion.button
      key="backButton"
      onClick={(e) => {
        e.preventDefault();
        backStepHomeMessage();
      }}
      initial={{
        opacity: 0,

        position: "absolute",
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
        position: "relative",
      }}
      exit={{
        opacity: 0,
        visibility: "none",
        position: "absolute",
      }}
    >
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
        />
      </motion.svg> */}
      <motion.svg
        // key="backButtonSVG"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1, transition: { duration: 0.25 } }}
        // exit={{ opacity: 0 }}
        // fill="rgb(96, 96, 63, .75)"
        // version="1.1"
        // id="Capa_1"
        // xmlns="http://www.w3.org/2000/svg"
        // xmlnsXlink="http://www.w3.org/1999/xlink"
        // width="22.5px"
        // height="22.5px"
        // viewBox="0 0 869.959 869.958"
        // xmlSpace="preserve"
        fill="rgb(96, 96, 63, .75)"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="22.5px"
        height="22.5px"
        viewBox="0 0 100 100"
        enable-background="new 0 0 100 100"
        xmlSpace="preserve"
      >
        <motion.g>
          <motion.path
            d="M74.656,56.818c3.895,3.729,5.788,8.795,5.788,15.491c0,1.104,0.896,2,2,2s2-0.885,2-1.989
		c0-7.736-2.362-13.91-7.022-18.369C66.646,43.639,46.325,44.551,30,45.269c-2.28,0.101-4.461,0.211-6.499,0.28L38.428,30.62
		c0.781-0.781,0.781-2.047,0-2.828s-2.048-0.781-2.828,0L17.479,45.915c-0.375,0.375-0.586,0.884-0.586,1.414
		s0.211,1.039,0.586,1.414l18.123,18.12c0.391,0.391,0.902,0.586,1.414,0.586s1.024-0.195,1.415-0.586
		c0.781-0.781,0.781-2.048,0-2.828L24.142,49.75c1.915-0.11,3.932-0.261,6.033-0.354C44.919,48.748,65.114,47.688,74.656,56.818z"
          />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
};

export default AnimatedHomeButtonBackProp;
