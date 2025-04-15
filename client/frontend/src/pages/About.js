import classes from "./About.module.css";
import Avatar1 from "./assets/graphic_action.png";
import Avatar3 from "./assets/IMG_0101.JPG";
import Avatar2 from "./assets/IMG_1896.jpg";
import React, { useState, useContext, useEffect } from "react";

function AboutPage() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 1000px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  return (
    <div className={classes.aboutBody}>
      <section>
        <h1 className={classes.aboutHeader}>About</h1>
        <div className={classes.aboutInnerPicture}>
          <div className={classes.aboutPic2Container}>
            <img className={classes.aboutPic} src={Avatar1} />
            <div className={classes.aboutPicb} />
          </div>
          <div className={classes.aboutInnerPictureText}>
            <p>
              Hello! I’m Joe Meehan, the founder of OptimaVita, a Nutrition,
              Wellness, and Longevity consulting company dedicated to helping
              individuals restore, optimize, and maintain their health through
              functional strategies.
            </p>
            {matches && (
              <>
                <p>
                  Although I’ve always been fascinated by the inner workings of
                  the human body, my passion for health and nutrition was truly
                  ignited in 2011 when my mom was diagnosed with cancer.
                  Watching her fight through that difficult time sparked a deep
                  curiosity about how nutrition can impact overall health. This
                  personal experience set me on a long journey of research,
                  trial and error, and optimization, all driven by the desire to
                  support and empower others in their own health journeys.
                </p>
                <p>
                  Throughout my college and professional basketball career, I
                  experienced numerous injuries, followed by significant health
                  challenges after my playing days ended. Each setback fueled my
                  determination to achieve optimal health. These personal
                  struggles led me to deepen my understanding of human
                  physiology and the critical role nutrition, exercise, and
                  lifestyle play in overall well-being.
                </p>
              </>
            )}
          </div>
        </div>
        {!matches && (
          <>
            <p>
              Although I’ve always been fascinated by the inner workings of the
              human body, my passion for health and nutrition was truly ignited
              in 2011 when my mom was diagnosed with cancer. Watching her fight
              through that difficult time sparked a deep curiosity about how
              nutrition can impact overall health. This personal experience set
              me on a long journey of research, trial and error, and
              optimization, all driven by the desire to support and empower
              others in their own health journeys.
            </p>
            <p>
              Throughout my college and professional basketball career, I
              experienced numerous injuries, followed by significant health
              challenges after my playing days ended. Each setback fueled my
              determination to achieve optimal health. These personal struggles
              led me to deepen my understanding of human physiology and the
              critical role nutrition, exercise, and lifestyle play in overall
              well-being.
            </p>
          </>
        )}
        <div className={classes.aboutInnerPicture2}>
          <div className={classes.aboutInnerPictureText2}>
            <p>
              After earning my Bachelors in Biology Pre-Med, I spent 9 years
              coaching collegiate basketball, where I helped athletes push their
              limits and achieve peak performance. During this time, my passion
              for nutrition and wellness continued to grow, leading me to
              amplify my knowledge and begin sharing it with others to help them
              achieve their optimal health, both on and off the court
            </p>
            {matches && (
              <>
                <p>
                  Driven by this realization, I earned a certificate in
                  nutrition coaching to expand my expertise on how nutrition
                  influences overall health. Combining my background in coaching
                  and my understanding of human physiology, I developed a
                  holistic approach to wellness that focuses on all aspects of
                  health—from nutrition and exercise to sleep optimization and
                  stress management.
                </p>
                <p>
                  At OptimaVita, I take a personalized, attentive approach to
                  coaching, helping individuals—whether overcoming health
                  challenges like obesity or striving to optimize their
                  fitness—develop sustainable strategies for lasting health and
                  vitality. My coaching is grounded in functional medicine,
                  which focuses on identifying and addressing the root causes of
                  health concerns for long-term well-being.
                </p>
              </>
            )}
          </div>
          <div className={classes.aboutPic2Container}>
            <img className={classes.aboutPic2} src={Avatar2} />
            <div className={classes.aboutPic2b} />
          </div>
        </div>
        {!matches && (
          <>
            <p>
              Driven by this realization, I earned a certificate in nutrition
              coaching to expand my expertise on how nutrition influences
              overall health. Combining my background in coaching and my
              understanding of human physiology, I developed a holistic approach
              to wellness that focuses on all aspects of health—from nutrition
              and exercise to sleep optimization and stress management.
            </p>
            <p>
              At OptimaVita, I take a personalized, attentive approach to
              coaching, helping individuals—whether overcoming health challenges
              like obesity or striving to optimize their fitness—develop
              sustainable strategies for lasting health and vitality. My
              coaching is grounded in functional medicine, which focuses on
              identifying and addressing the root causes of health concerns for
              long-term well-being.
            </p>
          </>
        )}
        {!matches ? (
          <div className={classes.aboutPic3OuterContainer}>
            <div className={classes.aboutPic3Container}>
              <img className={classes.aboutPic3} src={Avatar3} />
              <div className={classes.aboutPic3b} />
            </div>
            <p>
              Let’s work together to transform your health and unlock the
              vibrant, energized life you deserve.
            </p>
          </div>
        ) : (
          <div className={classes.aboutPic3OuterContainer}>
            <div className={classes.aboutPic3Container}>
              <img className={classes.aboutPic3} src={Avatar3} />
              <div className={classes.aboutPic3b} />
            </div>
            <p>
              Let’s work together to transform your health and unlock the
              vibrant, energized life you deserve.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AboutPage;
