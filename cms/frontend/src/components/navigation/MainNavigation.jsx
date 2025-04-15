import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

// import Avatar1 from "../assets/comadLogoV4a.svg";
// import Avatar2 from "../assets/nav_icon.svg";
// import Avatar3 from "../assets/comadLogoV3b.svg";
// import Avatar4 from "../assets/comadLogo_mobile_v1.svg";

// import { NavContext } from "./NavContext.jsx";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// import BookingSignup from "../header/BookingSignup";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  console.log("main");

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
    duration: 0,
    ease: "easeInOut",
    zIndex: 100,
    position: "fixed",
  };

  return (
    <motion.div className={classes.headerMain}>
      {!matches && (
        // <NavContext.Provider value={{ showNav, setShowNav, navMenu }}>
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
                  {/* <motion.img className={classes.navLogo} src={Avatar3} /> */}
                </motion.li>
                <motion.li
                  className={`${classes.listElement} ${classes.homeNavLi}`}
                >
                  <NavLink
                    to="/"
                    className={`${({ isActive }) =>
                      isActive ? classes.active : undefined} ${
                      classes.homeNav
                    }`}
                    onClick={navMenu}
                  >
                    Home
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
                <motion.li className={classes.liLineBreak}></motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/music"
                    className={`${({ isActive }) =>
                      isActive ? classes.active : undefined} ${
                      classes.nav_text
                    }`}
                    onClick={navMenu}
                  >
                    Music
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/dance"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Dance
                  </NavLink>
                </motion.li>
                <motion.li className={classes.listElement}>
                  <NavLink
                    to="/theater"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    Theater
                  </NavLink>
                </motion.li>
                {/* <BookingSignup /> */}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
        // </NavContext.Provider>
      )}
      <motion.header className={classes.header_1}>
        <motion.nav className={classes.navContainer}>
          <motion.div className={classes.logoContainer}>
            <NavLink to="/">
              {/* <motion.img className={classes.logo} src={Avatar4} /> */}
            </NavLink>
          </motion.div>
          {matches && (
            // <NavContext.Provider value={{ showNav, setShowNav, navMenu }}>
            <AnimatePresence>
              <motion.div
                key="nav_text"
                initial={{ opacity: 1, zIndex: 10 }}
                animate={{ opacity: 1 }}
                // transition={transition_text}
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
                  {/* <motion.li className={classes.listElement}>
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
                      to="/about"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      About
                    </NavLink>
                  </motion.li> */}
                  {/* <li className={classes.listElement}>
            <NavLink
              to="/yoga"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={navMenu}
            >
              Yoga
            </NavLink>
          </li> */}
                  {/* <motion.li className={classes.listElement}>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                    onClick={navMenu}
                  >
                    About
                  </NavLink>
                </motion.li> */}
                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/reserve"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Reserve
                    </NavLink>
                  </motion.li>
                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/tracks"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Tracks
                    </NavLink>
                  </motion.li>

                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/aviary"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Aviary
                    </NavLink>
                  </motion.li>
                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/nomad"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Nomad
                    </NavLink>
                  </motion.li>
                  <motion.li className={classes.listElement}>
                    <NavLink
                      to="/exhibit"
                      className={({ isActive }) =>
                        isActive ? classes.active : undefined
                      }
                      onClick={navMenu}
                    >
                      Exhibit
                    </NavLink>
                  </motion.li>
                  {/* <BookingSignup /> */}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
            // </NavContext.Provider>
          )}
          {!matches && (
            <motion.div className={classes.menuContainer} onClick={navMenu}>
              {/* <motion.img className={classes.menu} src={Avatar2} /> */}
            </motion.div>
          )}
        </motion.nav>
      </motion.header>
    </motion.div>
  );
}

export default MainNavigation;

// User Data: Animal Tracks
// Offerings Data: Wildlife Reserve
// Public Frontend Data: Exhibit Hall
// Marketing Data: Migration Patterns
// Events Data: Safari Schedule
