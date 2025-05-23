import Avatar1 from "./assets/home/home3.jpg";
import Avatar2 from "./assets/home/imgBio.jpg";
import classes from "./Profile.module.css";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Footer from "../footer/Footer";

function ProfilePage() {
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={classes.homeBackground}
          initial={{ backgroundPosition: "top left", opacity: 0 }}
          animate={{ backgroundPosition: "bottom right", opacity: 1 }}
          exit={{ backgroundPosition: "top left", opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <main className={classes.main}>
            <motion.section
              className={classes.heroSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={classes.heading}
              >
                Tune in. Play on.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className={classes.subheading}
              >
                Violin and Viola | Piano tuning | Perform
              </motion.p>
              <motion.p>
                Schedule and pay online with ease | In-home, In-studio, or
                virtual
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className={classes.buttonRow}
              >
                {/* Placeholder for buttons */}
              </motion.div>
            </motion.section>

            <section className={classes.infoGrid}>
              <div className={classes.card}>
                <h2 className={classes.cardTitle}>Private Lessons</h2>
                <p className={classes.cardText}>
                  Personalized violin and viola instruction for all levels.
                  Choose in-home sessions, come to my home studio, or meet
                  virtually.
                </p>
              </div>
              <div className={classes.card}>
                <h2 className={classes.cardTitle}>Piano Tuning</h2>
                <p className={classes.cardText}>
                  Ensure your piano sounds its best with professional tuning
                  services for upright and grand pianos.
                </p>
              </div>
              <div className={classes.card}>
                <h2 className={classes.cardTitle}>Easy Scheduling</h2>
                <p className={classes.cardText}>
                  Use the built-in scheduler to select a time and pay securely
                  online. It’s fast and convenient.
                </p>
              </div>
            </section>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default ProfilePage;
