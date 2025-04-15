import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import Avatar1 from "./assets/logo_company_adjacent.png";
import Avatar2 from "./assets/chooseyou-hamburger-menu.png";
import Avatar3 from "./assets/logo_icon.png";

import { NavContext } from "./NavContext";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import BookingSignup from "./BookingSignup";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 1000px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  const { showNav, setShowNav } = useContext(NavContext);
  const navMenu = () => {
    setShowNav(!showNav);
  };
  const transition_text = {
    duration: 0,
    ease: "easeInOut",
    zIndex: 100,
    position: "fixed",
  };

  return (
    <motion.div className={classes.headerMain}>
      <NavContext.Provider value={{ showNav, setShowNav, navMenu }}>
        <AnimatePresence>
          {showNav && (
            <motion.div
              key="nav_text"
              initial={{
                opacity: 0,
                x: 150,
                zIndex: 1000,
                position: "fixed",
              }}
              animate={{ opacity: 1, x: 0, zIndex: 1000, position: "fixed" }}
              transition={transition_text}
              exit={{ opacity: 0, x: 150, zIndex: 1000, position: "fixed" }}
              className={classes.listContainer}
              id="navBody"
            >
              <motion.div
                className={classes.listOuter}
                onClick={navMenu}
              ></motion.div>
              <motion.div className={classes.listLineBreak}></motion.div>
              <motion.ul className={classes.list}>
                <motion.li className={classes.navLogoContainer}>
                  <motion.img className={classes.navLogo} src={Avatar3} />
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Dashboard
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/enrollments"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Enrollments
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Services
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Settings
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/resources"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Resources
                  </NavLink>
                </motion.li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    `${isActive ? classes.active : ""} ${classes.login}`.trim()
                  }
                  onClick={navMenu}
                >
                  Log out
                </NavLink>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </NavContext.Provider>

      <motion.header className={classes.header_1}>
        <motion.nav className={classes.navContainer}>
          <motion.div className={classes.logoContainer}>
            <motion.div className={classes.menuContainer} onClick={navMenu}>
              <motion.img className={classes.menu} src={Avatar2} />
            </motion.div>
          </motion.div>

          <NavLink to="/" className={classes.logoContainer}>
            <motion.img className={classes.logo} src={Avatar1} />
          </NavLink>
        </motion.nav>
      </motion.header>
    </motion.div>
  );
}

export default MainNavigation;
