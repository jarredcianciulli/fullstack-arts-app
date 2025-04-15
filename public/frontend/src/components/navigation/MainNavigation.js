import NavigationIcon from "../pages/assets/nav_icon.svg";
import HeaderIconHome from "../../assets/home-2-svgrepo-com.svg";
import HeaderIconAbout from "../../assets/user-id-landscape-svgrepo-com.svg";
import HeaderIconProject from "../../assets/project-svgrepo-com.svg";
import HeaderIconContact from "../../assets/contact-message-svgrepo-com.svg";
import NavigationHeaderIcon from "./assets/logo_icon_whitebckgrd_white.svg";
import NavHomeTextStatic from "./assets/nav-home-static.svg";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const [showNav, setShowNav] = useState(false);

  const navClickAction = () => {
    setShowNav(!showNav);
  };
  const transition_text = { duration: 0.5, ease: "easeInOut" };

  return (
    <div className={classes.navigationSection}>
      <div className={classes.navigationContainer}>
        <AnimatePresence>
          {!showNav && (
            <motion.div
              className={classes.navigationHide}
              initial={{
                opacity: 0,
                transition: { duration: 0.3 },
              }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <motion.img
                onClick={navClickAction}
                className={classes.navIconStatic}
                alt=""
                src={NavigationIcon}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNav && (
            <>
              <motion.div
                className={classes.navigation}
                initial={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                  x: -250,
                }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                  x: 0,
                }}
                exit={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                  x: -250,
                }}
              >
                <motion.img
                  onClick={navClickAction}
                  className={classes.navIcon}
                  alt=""
                  src={NavigationHeaderIcon}
                />
                <motion.div
                  className={classes.navigationIconsContainer}
                ></motion.div>
                <AnimatePresence>
                  {showNav && (
                    <motion.div
                      className={classes.navTextContainer}
                      key="nav_text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={transition_text}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div className={classes.navHeaderContainer}>
                        <motion.div className={classes.navHeaderContainer}>
                          <Link
                            onClick={navClickAction}
                            to="/"
                            className={classes.navHeaderContainerInner}
                          >
                            <motion.img
                              cursor="pointer"
                              className={`${classes.navHeaderIconHome} ${classes.navHeaderIcon}`}
                              src={HeaderIconHome}
                            />
                            <motion.div
                              className={`${classes.home} ${classes.navHeaderText}`}
                            >
                              Home
                            </motion.div>
                          </Link>
                        </motion.div>
                        <motion.div className={classes.navHeaderContainer}>
                          <Link
                            onClick={navClickAction}
                            to="/about"
                            className={classes.navHeaderContainerInner}
                          >
                            <motion.img
                              cursor="pointer"
                              className={`${classes.navHeaderIconAbout} ${classes.navHeaderIcon}`}
                              src={HeaderIconAbout}
                            />
                            <motion.div
                              className={`${classes.bio} ${classes.navHeaderText}`}
                            >
                              About
                            </motion.div>
                          </Link>
                        </motion.div>
                        <motion.div className={classes.navHeaderContainer}>
                          <Link
                            onClick={navClickAction}
                            to="/resources"
                            className={classes.navHeaderContainerInner}
                          >
                            <motion.img
                              className={`${classes.navHeaderIconResources} ${classes.navHeaderIcon}`}
                              src={HeaderIconProject}
                            />
                            <motion.div
                              className={`${classes.resources} ${classes.navHeaderText}`}
                            >
                              Resources
                            </motion.div>
                          </Link>
                        </motion.div>
                        <motion.div className={classes.navHeaderContainer}>
                          <Link
                            onClick={navClickAction}
                            to="/contact"
                            className={classes.navHeaderContainerInner}
                          >
                            <motion.img
                              className={`${classes.navHeaderIconContact} ${classes.navHeaderIcon}`}
                              src={HeaderIconContact}
                            />
                            <motion.div
                              className={`${classes.contact} ${classes.navHeaderText}`}
                            >
                              Contact
                            </motion.div>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                onClick={navClickAction}
                className={classes.navigationActiveContainer}
              ></motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MainNavigation;
