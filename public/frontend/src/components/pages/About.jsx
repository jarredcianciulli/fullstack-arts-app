import RESUME_PDF from "./assets/jcianciulli-cv.pdf";
import RESUME_DOC from "./assets/jcianciulli-cv.docx";

import WordIcon from "./assets/icon_word.svg";
import PDFIcon from "./assets/icon_pdf.svg";
import ResumeHeader from "./assets/resume_header_line.svg";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import classes from "./About.module.css";

function AboutPage() {
  function downloadFileAtURL(url) {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  return (
    <AnimatePresence>
      <motion.div
        className={classes.subscriptionsPricingCardContainer}
        key="about"
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={transition_text}
        exit={{ opacity: 0 }}
      >
        <motion.div className={classes.aboutHeaderContainer}>
          <motion.img
            className={classes.aboutHeaderImg}
            alt=""
            src={ResumeHeader}
          />
          <motion.div className={classes.aboutVerticleHeaderContainer}>
            <motion.div className={classes.sectionAboutHeader}>
              About
            </motion.div>
            <motion.div className={classes.aboutHeaderIconsContainer}>
              <motion.div className={classes.iconPDFFile}>
                <motion.img
                  className={classes.vectorIcon}
                  alt=""
                  src={PDFIcon}
                  onClick={() => {
                    downloadFileAtURL(RESUME_PDF);
                  }}
                />
              </motion.div>
              <motion.div className={classes.iconWordFile}>
                <motion.img
                  className={classes.vectorIcon}
                  alt=""
                  src={WordIcon}
                  onClick={() => {
                    downloadFileAtURL(RESUME_DOC);
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className={classes.bioParagraphContainer}>
          <motion.p
            className={`${classes.bioParagraphText} ${classes.bioParagraphText_1}`}
          >
            Hey there! I'm Jarred, a violist currently situated in Lansdale PA.
            For my day job, I'm part of the payroll services team at Betterment,
            a financial firm that offers 401(k) plans. My musical journey began
            at a young age, as my parents own local performing arts schools. At
            the age of three I started with piano and voice lessons, and by
            seven, I ventured into the realm of the violin. It was not long
            before I made my inaugural performance at Verizon Hall within the
            revered Kimmel Center. 🌟
          </motion.p>
          <motion.p className={classes.bioParagraphText}>&nbsp;</motion.p>
          <motion.p className={classes.bioParagraphText}>
            Since then, I've appeared on many stages, including St. Mark's
            Church, St. Luke's Church, and notable halls such as Lincoln Center,
            Carnegie Hall, Lincoln Hall at the Union League of Philadelphia, and
            the Perelman Theater at the Kimmel Center. I had the privilege of
            sharing my music across continents, traversing North America,
            Europe, and Asia. 🧳
          </motion.p>
          <motion.p className={classes.bioParagraphText}>&nbsp;</motion.p>
          <motion.p className={classes.bioParagraphText}>
            Participation in distinguished music programs, such as the Trentino
            Music Festival and the Aspen Music Festival, has enriched my musical
            journey. Collaborations with acclaimed conductors, including Maestri
            Leonard Slatkin, Pierre Vallet, Manfred Honeck, Robert Spano, Hugh
            Wolff, J. David Jackson and Leon Fleisher, have further shaped my
            artistic endeavors. In 2019, I attained a Master's of Music Degree
            in Viola Performance from the esteemed Manhattan School of Music,
            where I was fortunate enough to study with renowned violist and
            mentor, Prof. Samuel Rhodes. 🎻
          </motion.p>
          <motion.p className={classes.bioParagraphText}>&nbsp;</motion.p>
          <motion.p className={classes.bioParagraphText}>
            Between my work at Betterment and teaching, I'm constantly motivated
            to keep up with my craft and share my knowledge. When I'm not busy
            practicing, you'll find me chipping away at a web project that
            collaborates music and technology. And when I need a break, I love
            spending quality time with my amazing family. Whether we're
            exploring the zoo, jamming to some music, hanging out at my parents
            schools, or cooking up a delicious meal at home, every moment is
            precious. ❤️👨‍👩‍👧‍👦
          </motion.p>
          <motion.p className={classes.bioParagraphText}>&nbsp;</motion.p>
          <motion.p className={classes.bioParagraphText}>
            #violalife #familytime #passionprojects #neverstoplearning
          </motion.p>
          <motion.p className={classes.bioParagraphText}>&nbsp;</motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AboutPage;
