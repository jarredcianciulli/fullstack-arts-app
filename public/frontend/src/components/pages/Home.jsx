import { useState, useEffect, useRef } from "react";
import classes from "./Home.module.css";
import { PopupButton } from "react-calendly";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import CalendarIcon from "./assets/subscriptions/icons/subscription_calendar_icon.svg";
import PolicyIcon from "./assets/subscriptions/icons/subscription_policy_icon.svg";
import ScheduleIcon from "./assets/subscriptions/icons/subscription_schedule_icon.svg";
import TimeIcon from "./assets/subscriptions/icons/subscription_time_icon.svg";
import TimelineIcon from "./assets/subscriptions/icons/subscription_timeline_icon.svg";
import GroupIcon from "./assets/subscriptions/icons/subscription_group_icon.svg";
import AgeGroupIcon from "./assets/subscriptions/icons/subscription_age_group_icon.svg";

//JSON
import pricingJSON from "./Pricing.json";

function HomePage() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 800px)").matches
  );
  const fieldStateContent = [];
  const fieldStateContentMap = pricingJSON.map((field) => {
    fieldStateContent.push({ flipCard: false, animatingFlipCard: false });
  });

  const [cardFlipState, setCardFlipState] = useState(fieldStateContent);

  useEffect(() => {
    window
      .matchMedia("(min-width: 800px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  function matchMedia(c, e) {
    return {
      opacity: 1,
      rotateY: c.flipCard ? 180 : 0,
    };
  }
  function notMatchMedia(e) {
    return {
      opacity: 1,
      rotateX: cardFlipState[e].flipCard ? 180 : 0,
      rotateY: cardFlipState[e].flipCard ? 0 : 0,
    };
  }
  useEffect(() => {
    matchMedia;
    notMatchMedia;
  }, [cardFlipState]);
  function flipCard(e, cardIndex) {
    console.log(e);
    const newArray = [...cardFlipState];

    const updatedArray = newArray.map((cardFlipStates, index) => {
      if (cardIndex === index) {
        (cardFlipStates.flipCard = !cardFlipStates.flipCard), cardFlipStates;
      }
      return cardFlipStates;
    });
    setCardFlipState(newArray);
  }
  function falseClick(e) {
    e.stopPropagation();
    console.log("hoho");
  }
  function mediaChangeListener(ind) {
    return {
      opacity: 1,
      rotateX: cardFlipState[ind].flipCard ? 0 : 0,
      rotateY: cardFlipState[ind].flipCard ? 180 : 0,
    };
  }

  function smallMediaChangeListener(ind) {
    return {
      opacity: 1,
      rotateX: cardFlipState[ind].flipCard ? 180 : 0,
      rotateY: cardFlipState[ind].flipCard ? 0 : 0,
    };
  }
  const homeCardOptions = pricingJSON.map((e, ind) => {
    // let time;
    // if (typeof e.course_structure === "object") {
    //   let timeFormatter;
    //   timeFormatter = new Date(e.course_structure.first_class);
    //   time = timeFormatter.toLocaleDateString("en-US", {
    //     month: "long",
    //     day: "numeric",
    //     year: "numeric",
    //     hour: "numeric",
    //     minute: "numeric",
    //   });
    // }
    const transition_text = {
      duration: 0.3,
      ease: "easeInOut",
    };

    const ref = useRef([]);
    const refButton = useRef();

    return (
      <AnimatePresence>
        <motion.card
          className={classes.subscriptionsPricingCardContainer}
          key={ind}
          ref={(el) => (ref.current[ind] = el)}
          initial={{
            opacity: 0,
          }}
          animate={
            matches ? mediaChangeListener(ind) : smallMediaChangeListener(ind)
          }
          transition={transition_text}
          exit={{ opacity: 0 }}
          onClick={(el) => flipCard(el.target, ind)}
        >
          <motion.div
            className={`${classes.subscriptionsPricingCardFront}`}
            // animate={{
            //   position: isFlipped ? "absolute" : "relative",
            //   visibility: !isFlipped ? "visible" : "hidden",
            // }}
          >
            <motion.div className={classes.subscriptionsPricingCardHeader}>
              <motion.div
                className={classes.subscriptionsPricingCardHeaderTitle}
              >
                {e.title}
              </motion.div>
              {matches && (
                <motion.div
                  className={classes.subscriptionsPricingCardHeaderContainer}
                >
                  <motion.div
                    className={classes.subscriptionsPricingCardHeaderSubject}
                  >
                    {e.header}
                  </motion.div>
                  <motion.div
                    className={classes.subscriptionsPricingCardHeaderHeadline}
                  >
                    {e.slogan}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
            {/* <motion.div
                className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakBody}
                    `}
              ></motion.div> */}

            <motion.div className={classes.subscriptionsPricingCardBody}>
              <motion.div
                className={classes.subscriptionsPricingCardBodyPricingContainer}
              >
                {!matches && (
                  <motion.div
                    className={classes.subscriptionsPricingCardHeaderContainer}
                  >
                    <motion.div
                      className={classes.subscriptionsPricingCardHeaderSubject}
                    >
                      {e.header}
                    </motion.div>
                    {/* <motion.div
                        className={
                          classes.subscriptionsPricingCardHeaderHeadline
                        }
                      >
                        Gamifying Music Education for Kids in a Virtual Group
                        Setting
                      </motion.div> */}
                  </motion.div>
                )}
                <motion.div
                  className={classes.subscriptionsPricingCardBodyInfoContainer}
                >
                  {matches && (
                    <motion.div
                      className={
                        classes.subscriptionsPricingCardBodyInfoSpecContainer
                      }
                    >
                      <motion.div
                        className={`
                        ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                      `}
                      ></motion.div>
                      {matches && (
                        <motion.div
                          className={
                            classes.subscriptionsPricingCardBodyInfoIconContainer
                          }
                        >
                          <motion.div
                            className={
                              classes.subscriptionsPricingCardBodyInfoIconContainerRow
                            }
                          >
                            <motion.div
                              className={
                                classes.subscriptionsPricingCardBodySessionContainer
                              }
                            >
                              <motion.img
                                alt="time icon"
                                src={TimeIcon}
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionDurationIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                              />
                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionDuration} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                              >
                                {typeof e.duration === "object"
                                  ? e.duration.duration_min +
                                    "-" +
                                    e.duration.duration_max +
                                    " mins"
                                  : e.duration + " minutes"}
                              </motion.div>
                            </motion.div>
                            <motion.div
                              className={
                                classes.subscriptionsPricingCardBodySessionContainer
                              }
                            >
                              <motion.img
                                alt="calendar icon"
                                src={CalendarIcon}
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionFrequencyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                              />
                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionTiming} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                              >
                                {typeof e.frequency === "object"
                                  ? e.frequency.frequency_min +
                                    "-" +
                                    e.frequency.frequency_max +
                                    " months"
                                  : e.frequency}
                              </motion.div>
                            </motion.div>
                          </motion.div>
                          {/* <motion.div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIcons}
                    `}
                      ></motion.div> */}
                          <motion.div
                            className={
                              classes.subscriptionsPricingCardBodyInfoIconContainerRow
                            }
                          >
                            <motion.div
                              className={
                                classes.subscriptionsPricingCardBodySessionContainer
                              }
                            >
                              <motion.img
                                alt="verticle timeline icon"
                                src={TimelineIcon}
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionTimelineIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                              />

                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                              >
                                {e.session_count == 1
                                  ? e.session_count + " session"
                                  : e.session_count + " sessions"}
                              </motion.div>
                            </motion.div>
                            <motion.div
                              className={
                                classes.subscriptionsPricingCardBodySessionContainer
                              }
                            >
                              <motion.img
                                alt="group icon"
                                src={GroupIcon}
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                              />
                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                              >
                                {e.student_count == 1
                                  ? "1:1 sessions"
                                  : e.student_count}
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      )}
                      {e.course_structure ? null : (
                        <motion.div
                          className={`
                        ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                      `}
                        ></motion.div>
                      )}
                      {/*
                      {e.course_structure ? (
                        <>
                          <motion.div
                            className={`
                        ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                      `}
                          ></motion.div>
                          <motion.div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStart} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                          >
                            {"First class of Spring" +
                              e.course_structure.cadence +
                              " :"}
                          </motion.div>
                          <motion.div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStartValue} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                          >
                            {time}
                          </motion.div>
                        </>
                      ) : null} */}
                      <motion.div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                      >
                        {typeof e.price === "object"
                          ? "$" +
                            e.price.price_min +
                            "-" +
                            e.price.price_max +
                            "/session"
                          : "$" + e.price + "/session"}
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
            {!matches && (
              <motion.div
                className={
                  classes.subscriptionsPricingCardBodyInfoIconContainer
                }
              >
                <motion.div
                  className={
                    classes.subscriptionsPricingCardBodyInfoIconContainerRow
                  }
                >
                  <motion.div
                    className={
                      classes.subscriptionsPricingCardBodySessionContainer
                    }
                  >
                    <motion.img
                      alt="time icon"
                      src={TimeIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionDurationIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionDuration} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {typeof e.duration === "object"
                        ? e.duration.duration_min +
                          "-" +
                          e.duration.duration_max +
                          " mins"
                        : e.duration + " minutes"}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className={
                      classes.subscriptionsPricingCardBodySessionContainer
                    }
                  >
                    <motion.img
                      alt="calendar icon"
                      src={CalendarIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionFrequencyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTiming} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {typeof e.frequency === "object"
                        ? e.frequency.frequency_min +
                          "-" +
                          e.frequency.frequency_max +
                          " months"
                        : e.frequency}
                    </motion.div>
                  </motion.div>
                </motion.div>
                {/* <motion.div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIcons}
                    `}
                      ></motion.div> */}
                <motion.div
                  className={
                    classes.subscriptionsPricingCardBodyInfoIconContainerRow
                  }
                >
                  <motion.div
                    className={
                      classes.subscriptionsPricingCardBodySessionContainer
                    }
                  >
                    <motion.img
                      alt="verticle timeline icon"
                      src={TimelineIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTimelineIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />

                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {e.session_count + " sessions"}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className={
                      classes.subscriptionsPricingCardBodySessionContainer
                    }
                  >
                    <motion.img
                      alt="group icon"
                      src={GroupIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {e.student_count == 1
                        ? "1:1 sessions"
                        : e.student_count + " per group"}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            <motion.div className={classes.subscriptionsPricingCardFooter}>
              {!matches && (
                <motion.div
                  className={
                    classes.subscriptionsPricingCardBodyInfoSpecContainer
                  }
                >
                  {/* <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStart} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                    >
                      First class of Spring trimester:
                    </motion.div>
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStartValue} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                    >
                      February 1st, 2024 at 5PM
                    </motion.div> */}

                  <motion.div
                    className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                  >
                    {typeof e.price === "object"
                      ? "$" +
                        e.price.price_min +
                        "-" +
                        e.price.price_max +
                        "/session"
                      : "$" + e.price + "/session"}
                  </motion.div>
                  <motion.div onClick={(d) => falseClick(d)}>
                    <PopupButton
                      className={`${
                        classes.subscriptionsPricingCardFooterButton
                      } ${
                        cardFlipState[ind].flipCard &&
                        classes.subscriptionsPricingCardFooterButtonDisabled
                      }`}
                      url={e.calendly_url}
                      /*
                       * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                       * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                       */
                      rootElement={document.getElementById("root")}
                      text={e.cta_button_name}
                    />
                  </motion.div>
                  {/* <motion.button
                    className={`${
                      classes.subscriptionsPricingCardFooterButton
                    } ${
                      cardFlipState[ind].flipCard &&
                      classes.subscriptionsPricingCardFooterButtonDisabled
                    }`}
                    ref={refButton}
                    onClick={(d) => falseClick(d)}
                    disabled={cardFlipState[ind].flipCard}
                  >
                    {e.cta_button_name}
                  </motion.button> */}
                </motion.div>
              )}
              {matches && (
                <motion.div onClick={(d) => falseClick(d)}>
                  <PopupButton
                    className={`${
                      classes.subscriptionsPricingCardFooterButton
                    } ${
                      cardFlipState[ind].flipCard &&
                      classes.subscriptionsPricingCardFooterButtonDisabled
                    }`}
                    url={e.calendly_url}
                    /*
                     * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                     * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                     */
                    rootElement={document.getElementById("root")}
                    text={e.cta_button_name}
                  />
                </motion.div>
                // <motion.button
                //   className={`${classes.subscriptionsPricingCardFooterButton} ${
                //     cardFlipState[ind].flipCard &&
                //     classes.subscriptionsPricingCardFooterButtonDisabled
                //   }`}
                //   ref={refButton}
                //   onClick={(d) => falseClick(d)}
                //   disabled={cardFlipState[ind].flipCard}
                // >
                //   {e.cta_button_name}
                // </motion.button>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            className={`${classes.subscriptionsPricingCardBack} ${
              !matches && classes.subscriptionsPricingCardBack_media
            }
            }`}
          >
            <motion.div
              className={
                classes.subscriptionsPricingCardBodyDescriptionContainer
              }
            >
              <motion.div className={classes.subscriptionsPricingCardBodyPitch}>
                {e.description}
              </motion.div>
              <motion.div
                className={classes.subscriptionsPricingCardBodyHighlight}
              >
                {e.hashtags}
              </motion.div>
            </motion.div>
            <motion.div
              className={
                classes.subscriptionsPricingCardBodyExtendedInfoSection
              }
            >
              <motion.div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoContainer
                }
              >
                <motion.img src="" alt="" />
                <motion.div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoText
                  }
                >
                  Schedule
                </motion.div>
              </motion.div>
              <motion.div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoContainer
                }
              >
                <motion.img src="" alt="" />
                <motion.div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoText
                  }
                >
                  Policy
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.card>
      </AnimatePresence>
    );
  });

  useEffect(() => {
    window
      .matchMedia("(min-width: 800px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  return (
    <div className={classes.subscriptionsMainContainer}>
      <div className={classes.subscriptionsHeaderContainer}>
        <div className={classes.subscriptionsPricingCardsContainer}>
          {homeCardOptions}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
