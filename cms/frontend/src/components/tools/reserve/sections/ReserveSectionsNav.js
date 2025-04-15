import React from "react";
import { NavLink } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import classes from "../ReserveNav.module.css";

const ReserveSectionsNav = () => {
  return (
    <motion.div className={classes.mainTreck}>
      <motion.div className={classes.lineBreakReserveNav}></motion.div>
      {/* <motion.ul className={classes.list}>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/sections"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Sections
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/events"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Events
          </NavLink>
        </motion.li>
      </motion.ul> */}
    </motion.div>
  );
};

export default ReserveSectionsNav;
