import sectionsJSON from "../../data/sections.json";
import Services from "./services/Services";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./Sections.module.css";

function Sections() {
  //   let SectionsData;
  console.log(sectionsJSON.sections);
  const SectionsData = sectionsJSON.sections.map((e, ind) => {
    const transition_text = {
      duration: 0.3,
      ease: "easeInOut",
    };

    return (
      <AnimatePresence transition={transition_text}>
        <motion.div className={classes.titleContainer}>
          <motion.div className={classes.title}>{e.title}</motion.div>
          <motion.div className={classes.titleLine} />
        </motion.div>
        <Services
          key={ind}
          id={e.id}
          title={e.title}
          headline={e.headline}
          summary={e.summary}
          description={e.description}
          hashtags={e.hashtags}
          specification={e.specification}
          instruments={e.instruments}
          format={e.format}
        />
      </AnimatePresence>
    );
  });
  return <>{SectionsData}</>;
}

export default Sections;
