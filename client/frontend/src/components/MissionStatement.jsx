import React, { useState, useRef, useEffect } from "react";

import Avatar1 from "../pages/assets/amanda-jones-e3jKBZoRnTs-unsplash.jpg";
import Avatar2 from "../pages/assets/chooseyou_img_1a.png";
import Avatar3 from "../pages/assets/fatih-kgqu_qs3B78-unsplash.jpg";
import Avatar4 from "../pages/assets/jene-stephaniuk--MCrF6hnojU-unsplash.jpg";
import Avatar5 from "../pages/assets/katrina-wright-yMg_SMqfoRU-unsplash.jpg";
import Avatar6 from "../pages/assets/khadeeja-yasser-FHT0KEOwtyg-unsplash.jpg";
import Avatar7 from "../pages/assets/chooseyou_img_2.png";
import Avatar8 from "../pages/assets/doing_my_best.jpg";
import Avatar9 from "../pages/assets/pregnant_belly.jpg";
import Avatar10 from "../pages/assets/happy balloons.jpg";
import Avatar11 from "../pages/assets/painted hand.jpg";
import { ReactComponent as Logo } from "./assets/chooseyou-mission-img.svg";
import classes from "./MissionStatement.module.css";
import { motion, AnimatePresence } from "framer-motion";
// import PageContent from "../components/PageContent";

function MissionStatement() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const modalSetting = () => {
    setShowAboutModal(!showAboutModal);

    if (showAboutModal == false) {
      showOverlay();
    } else {
      removeOverlay();
    }
  };

  function showOverlay() {
    const mainEl = document.querySelector("html");
    mainEl.style.overflow = "hidden";
  }

  function removeOverlay() {
    const mainEl = document.querySelector("html");
    mainEl.style.overflow = "auto";
  }
  const transition_text = {
    duration: 0.33,
    ease: "easeInOut",
  };
  return (
    <motion.div className={classes.main}>
      {/* <section>
        <h2 className={classes.homeHeader}>Mission statement</h2>
        <p>
          At OptimaVita, we believe that true health is not just the absence of
          illness, but the presence of vitality, energy, and balance in every
          aspect of life. We are a wellness and longevity consulting company
          dedicated to helping individuals restore, optimize, and maintain their
          health through the power of functional medicine.
        </p>
        <p>
          Our mission is simple: to guide you on your journey toward peak
          wellness. Whether you're looking to enhance your fitness or overcome
          challenges like obesity, our holistic approach integrates personalized
          nutrition, sleep optimization, exercise strategies, and stress
          reduction techniques to create a path to long-lasting health.
        </p>
        <p>
          What sets OptimaVita apart is our unwavering commitment to your unique
          needs. Our highly attentive consulting and coaching services are
          designed to provide tailored support and guidance, ensuring you
          receive the best care at every step. We focus on the root causes of
          health issues and work with you to develop a sustainable plan for a
          healthier, more vibrant life.
        </p>
        <p>
          Join us at OptimaVita, and take the first step toward an optimized
          you.
        </p>
      </section> */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div>
            <motion.div className={classes.aboutMeModalMainBackdropContainer}>
              <motion.div
                key="nav_text_2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition_text}
                exit={{ opacity: 0 }}
                className={classes.aboutMeModalMainBackdrop}
                onClick={modalSetting}
              ></motion.div>
              <motion.div
                key="nav_text_2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition_text}
                exit={{ opacity: 0 }}
                className={classes.aboutMeModalMain}
              >
                <motion.div className={classes.aboutMeModalHeader}>
                  Mission Statement
                </motion.div>
                <motion.div className={classes.aboutMeModalBody}>
                  <motion.div
                    className={`${classes.aboutMeModalP} ${classes.aboutMeModalP1}`}
                  >
                    {/* <section>
        <h2 className={classes.homeHeader}>Mission statement</h2>
        <p>
          At OptimaVita, we believe that true health is not just the absence of
          illness, but the presence of vitality, energy, and balance in every
          aspect of life. We are a wellness and longevity consulting company
          dedicated to helping individuals restore, optimize, and maintain their
          health through the power of functional medicine.
        </p>
        <p>
          Our mission is simple: to guide you on your journey toward peak
          wellness. Whether you're looking to enhance your fitness or overcome
          challenges like obesity, our holistic approach integrates personalized
          nutrition, sleep optimization, exercise strategies, and stress
          reduction techniques to create a path to long-lasting health.
        </p>
        <p>
          What sets OptimaVita apart is our unwavering commitment to your unique
          needs. Our highly attentive consulting and coaching services are
          designed to provide tailored support and guidance, ensuring you
          receive the best care at every step. We focus on the root causes of
          health issues and work with you to develop a sustainable plan for a
          healthier, more vibrant life.
        </p>
        <p>
          Join us at OptimaVita, and take the first step toward an optimized
          you.
        </p>
      </section> */}
                    At OptimaVita, we believe that true health is not just the
                    absence of illness, but the presence of vitality, energy,
                    and balance in every aspect of life. We are a wellness and
                    longevity consulting company dedicated to helping
                    individuals restore, optimize, and maintain their health
                    through the power of functional medicine.
                  </motion.div>
                  <motion.div
                    className={`${classes.aboutMeModalP} ${classes.aboutMeModalP1}`}
                  >
                    Our mission is simple: to guide you on your journey toward
                    peak wellness. Whether you're looking to enhance your
                    fitness or overcome challenges like obesity, our holistic
                    approach integrates personalized nutrition, sleep
                    optimization, exercise strategies, and stress reduction
                    techniques to create a path to long-lasting health.
                  </motion.div>
                  <motion.div
                    className={`${classes.aboutMeModalP} ${classes.aboutMeModalP2}`}
                  >
                    What sets OptimaVita apart is our unwavering commitment to
                    your unique needs. Our highly attentive consulting and
                    coaching services are designed to provide tailored support
                    and guidance, ensuring you receive the best care at every
                    step. We focus on the root causes of health issues and work
                    with you to develop a sustainable plan for a healthier, more
                    vibrant life.
                  </motion.div>

                  <motion.div
                    className={`${classes.aboutMeModalP} ${classes.aboutMeModalP2}`}
                  >
                    Join us at OptimaVita, and take the first step toward an
                    optimized you.
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section className={classes.missionSection}>
        <h2 className={classes.homeHeader}>Mission statement</h2>
        <p>
          At OptimaVita, we believe that true health is not just the absence of
          illness, but the presence of vitality, energy, and balance in every
          aspect of life. We are a wellness and longevity consulting company
          dedicated to helping individuals restore, optimize, and maintain their
          health through the power of functional medicine...
        </p>

        <motion.div className={classes.buttonAboutContainer}>
          <motion.button className={classes.buttonAbout} onClick={modalSetting}>
            Read more
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
}

export default MissionStatement;
