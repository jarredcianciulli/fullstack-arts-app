import sectionsJSON from "../data/sections.json";
import ServicesRoot from "./ServicesRoot";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./Sections.module.css";

function Sections() {
  return (
    <AnimatePresence>
      {sectionsJSON.sections.map((e, ind) => {
        return (
          <motion.div
            key={e.id} // Added unique key
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={classes.titleContainer}>
              <div className={classes.titleLine} />

              <div className={classes.title}>{e.title}</div>
              <div className={classes.titleLine} />
            </div>
            <ServicesRoot
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
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

export default Sections;
