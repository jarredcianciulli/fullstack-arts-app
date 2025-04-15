import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import classes from "./TracksNav.module.css";

const TracksNav = () => {
  const { group_id } = useParams();
  return (
    <motion.div className={classes.mainTreck}>
      <motion.div className={classes.lineBreakMusicNav}></motion.div>
      <motion.ul className={classes.list}>
        <motion.li className={classes.listElement}>
          <NavLink
            to={`/treck/music/group/${group_id}/overview`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Overview
          </NavLink>
        </motion.li>
        <motion.li className={classes.listElement}>
          <NavLink
            to={`/treck/music/group/${group_id}/classes`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Classes
          </NavLink>
        </motion.li>

        <motion.li className={classes.listElement}>
          <NavLink
            to={`/treck/music/group/${group_id}/enrollment`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Enrollment
          </NavLink>
        </motion.li>

        <motion.li className={classes.listElement}>
          <NavLink
            to={`/treck/music/group/${group_id}/attendance`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Attendance
          </NavLink>
        </motion.li>

        <motion.li className={classes.listElement}>
          <NavLink
            to={`/treck/music/group/${group_id}/billing`}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Billing
          </NavLink>
        </motion.li>
        {/* <BookingSignup /> */}
      </motion.ul>
    </motion.div>
  );
};

export default MusicGroupNav;
