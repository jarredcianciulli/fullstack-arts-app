import React from "react";
import { NavLink } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import classes from "../../ReserveNav.module.css";

const ReserveSectionsServicesNav = () => {
  return (
    <motion.div className={classes.mainTreck}>
      <motion.div className={classes.lineBreakReserveNav}></motion.div>
      <motion.ul className={classes.list}>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/sections/overview"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Overview
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/options"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Options
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/enrollment"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Enrollment
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/attendance"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Attendance
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to="/reserve/billing"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Billing
          </NavLink>
        </motion.li>
      </motion.ul>
    </motion.div>
  );
};

export default ReserveSectionsServicesNav;
