import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import Avatar1 from "./assets/intono-logo-icon.png";
import Avatar2 from "../pages/assets/nav_icon.svg";
import Avatar3 from "./assets/intono-logo-v1.png";

import { NavContext } from "./NavContext.jsx";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import BookingSignup from "../header/BookingSignup.js";
import classes from "./Navigation.module.css";

function Navigation() {
  const [showNav, setShowNav] = useState(false);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 1000px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  const navMenu = () => {
    setShowNav(!showNav);
  };
  const transition_text = {
    duration: 0.3,
    ease: "easeOut",
    zIndex: 1000,
    position: "fixed",
  };

  return (
    <motion.div className={classes.headerMain}>
      {!matches && (
        <NavContext.Provider value={{ showNav, setShowNav, navMenu }}>
          <AnimatePresence>
            {showNav && (
              <motion.div
                key="nav_text"
                initial={{
                  opacity: 0,
                  x: "100%",
                  zIndex: 1000,
                  position: "fixed",
                }}
                animate={{ opacity: 1, x: 0, zIndex: 1000, position: "fixed" }}
                transition={transition_text}
                exit={{
                  opacity: 0,
                  x: "100%",
                  zIndex: 1000,
                  position: "fixed",
                }}
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
                    <motion.img className={classes.navLogo} src={Avatar1} />
                  </motion.li>
                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Home
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
                      to="/about"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      About
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
                  <BookingSignup />
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </NavContext.Provider>
      )}
      <motion.header className={classes.header_1}>
        <motion.nav className={classes.navContainer}>
          <motion.div className={classes.logoContainer}>
            <motion.img className={classes.logo} src={Avatar3} />
          </motion.div>
          {matches && (
            <NavContext.Provider value={{ showNav, setShowNav, navMenu }}>
              <AnimatePresence>
                <motion.div
                  key="nav_text"
                  initial={{ opacity: 1, zIndex: 10 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={classes.listContainer}
                  id="navBody"
                >
                  <motion.div
                    className={classes.listOuter}
                    onClick={navMenu}
                  ></motion.div>
                  <motion.div className={classes.listLineBreak}></motion.div>
                  <motion.ul className={classes.list}>
                    <motion.li className={classes.listElement}>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          isActive ? classes.active : undefined
                        }
                        onClick={navMenu}
                      >
                        Home
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
                        to="/about"
                        className={({ isActive }) =>
                          isActive ? classes.active : undefined
                        }
                        onClick={navMenu}
                      >
                        About
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
                    <BookingSignup />
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </NavContext.Provider>
          )}
          {!matches && (
            <motion.div className={classes.menuContainer} onClick={navMenu}>
              <motion.img className={classes.menu} src={Avatar2} />
            </motion.div>
          )}
        </motion.nav>
      </motion.header>
    </motion.div>
  );
}

export default Navigation;
