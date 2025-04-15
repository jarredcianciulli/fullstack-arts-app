import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import classes from "./Resources.module.css";
function ResourcesPage() {
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  return (
    <AnimatePresence>
      <motion.div
        className={classes.resourcesMainContainer}
        key="resources"
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={transition_text}
        exit={{ opacity: 0 }}
      >
        <motion.div className={classes.resourcesInnerContainer}>
          <motion.div className={classes.resourcesHeader}>
            Exersize System
          </motion.div>
          <motion.div className={classes.resourcesInputContainer}>
            <motion.div className={classes.resourcesInputContainerInner}>
              <motion.div className={classes.resourcesHeaderField}>
                Created by:
              </motion.div>
              <motion.div className={classes.resourcesHeaderValue}>
                <motion.a
                  href="https://www.juilliard.edu/music/faculty/rhodes-samuel"
                  target="_blank"
                  className={classes.resourcesHeaderValueATag}
                >
                  Prof. Samuel Rhodes
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div className={classes.resourcesHeaderRecreatedField}>
              Rerendered for this website by Jarred Cianciulli
            </motion.div>
          </motion.div>

          <motion.div className={classes.resourcesLinksContainer}>
            <Link
              to="/resources/prof_rhodes_scale_system"
              className={`${classes.resourcesLink} ${classes.resourcesLinkScales}`}
            >
              System
            </Link>
            <Link
              to="/resources/scales"
              className={`${classes.resourcesLink} ${classes.resourcesLinkScales}`}
            >
              Scales
            </Link>
            <Link
              to="/resources/arpeggios"
              className={`${classes.resourcesLink} ${classes.resourcesLinkArpeggios}`}
            >
              Arpeggios
            </Link>
            {/* <Link
            to="/resources/double_stops"
            className={`${classes.resourcesLink} ${classes.resourcesDoubleS}`}
          >
            Double Stops
          </Link>
          <Link
            to="/resources/modes"
            className={`${classes.resourcesLink} ${classes.resourcesLinkModes}`}
          >
            Modes
          </Link> */}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ResourcesPage;
