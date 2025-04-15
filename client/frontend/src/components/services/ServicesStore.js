import { useState, useEffect, useRef } from "react";
import classes from "./Services.module.css";
import { PopupButton } from "react-calendly";
import { NavLink, Form, useRouteLoaderData } from "react-router-dom";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import CalendarIcon from "../assets/subscriptions/icons/subscription_calendar_icon.svg";
import PolicyIcon from "../assets/subscriptions/icons/subscription_policy_icon.svg";
import ScheduleIcon from "../assets/subscriptions/icons/subscription_schedule_icon.svg";
import TimeIcon from "../assets/subscriptions/icons/subscription_time_icon.svg";
import TimelineIcon from "../assets/subscriptions/icons/subscription_timeline_icon.svg";
import GroupIcon from "../assets/subscriptions/icons/subscription_group_icon.svg";
import AgeGroupIcon from "../assets/subscriptions/icons/subscription_age_group_icon.svg";
import DownloadPDF from "../assets/subscriptions/icons/download_pdf.svg";
import PopupIcon from "../assets/subscriptions/icons/popup_icon.svg";

import useMediaQuery from "../utils/UI/UseMediaQuery";
// import Calendar from "../calendar/Calendar";
// import FormStore from "../registration/FormStore";
//JSON
import ServicesJSON from "../data/services.json";

function ServicesStore({ id, e, prop, ind }) {
  const [isAPopupOpen, setIsAPopupOpen] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 800px)").matches
  );

  const popupRef = useRef(null);

  const fieldStateContent = [];
  const fieldStateContentMap = ServicesJSON.services.map((field) => {
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

  function handleRegistrationClick() {
    setIsFormOpen(!isFormOpen);
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
    if (isAPopupOpen) {
      return;
    }
    console.log(e);
    const newArray = [...cardFlipState];

    const updatedArray = newArray.map((cardFlipStates, index) => {
      if (cardIndex === index) {
        (cardFlipStates.flipCard = cardFlipStates.flipCard), cardFlipStates;
      }
      return cardFlipStates;
    });
    setCardFlipState(newArray);
  }
  function falseClick(e) {
    e.stopPropagation();
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

  //   const homeCardOptions = ServicesJSON.services.map((e, ind) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsAPopupOpen(!isAPopupOpen);
    setIsPopupOpen(!isPopupOpen);
  };
  const [isFormOpen, setIsFormOpen] = useState(false);

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  const ref = useRef([]);
  const refButton = useRef();
  console.log(prop.id);

  if (prop.id == e.section) {
    console.log(prop.id);
    let Frequency;
    let Duration;
    function arrayToStringWithAnd(arr) {
      console.log(arr);
      if ((!Array.isArray(arr) || arr.length) === 0 || prop.format === 2) {
        return "";
      } else if (arr.length === 1) {
        return arr[0];
      } else if (arr.length === 2) {
        return arr.join(" and ");
      }
      const lastElement = arr.pop();
      return arr.join(", ") + ", and " + lastElement;
    }
    const Instrument = arrayToStringWithAnd(prop.instruments);
    if (e.frequency.type === "months") {
      Frequency =
        e.frequency.frequency_min + "-" + e.frequency.frequency_max + " months";
    } else if (e.frequency.type === "absolute") {
      Frequency = e.frequency.frequency_min + "-" + e.frequency.frequency_max;
    } else if (e.frequency.type === "static") {
      Frequency = e.frequency.property;
    }
    if (e.duration.type === "multiple minutes options") {
      Duration =
        e.duration.duration_min + "-" + e.duration.duration_max + " mins";
    } else if (e.duration.type === "multiple minutes determinate") {
      Duration =
        e.duration.duration_min + "-" + e.duration.duration_max + " mins";
    } else if (e.duration.type === "minutes static") {
      Duration = e.duration.mins + " minutes";
    }

    return (
      <AnimatePresence>
        {/* <Calendar
          isOpen={isPopupOpen}
          ref={popupRef}
          handleClose={(el) => togglePopup(el)}
          service_id={e.id}
          section_id={prop.id}
          availability_organization={e.availability_organization}
        /> */}
        {/* <FormStore
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          sectionId={prop.id}
          serviceData={e}
          sectionData={prop}
        /> */}
        <motion.card
          className={`${classes.subscriptionsPricingCardContainer} ${
            cardFlipState[ind].flipCard ? `${classes.flipped}` : ""
          }`}
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
              {/* <motion.div
                className={classes.subscriptionsPricingCardHeaderTitle}
              >
                {prop.specification}
              </motion.div> */}
              {/* <motion.div
                className={classes.subscriptionsPricingCardHeaderInstrument}
              >
                {Instrument}
              </motion.div> */}

              <motion.div
                className={
                  classes.subscriptionsPricingCardHeaderInstrumentContainer
                }
              >
                <motion.div
                  className={classes.subscriptionsPricingCardHeaderInstrument}
                >
                  {e.service_package}
                </motion.div>
                {!matches & e.price.discount_percent ? (
                  <motion.div
                    className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPercent}
                    `}
                  >
                    {e.price.discount_percent}% discount
                  </motion.div>
                ) : (
                  ""
                )}
              </motion.div>

              <motion.div
                className={
                  classes.subscriptionsPricingCardHeaderLocationPropertyBackgroundContainer
                }
              >
                <motion.div
                  className={
                    classes.subscriptionsPricingCardHeaderLocationPropertyBackground
                  }
                ></motion.div>
              </motion.div>
              {/* {matches && (
                //   <motion.div
                //     className={classes.subscriptionsPricingCardHeaderContainer}
                //   >
                    {/* <motion.div
                      className={classes.subscriptionsPricingCardHeaderSubject}
                    >
                      {e.header}
                    </motion.div> */}
              {/* <motion.div
                      className={classes.subscriptionsPricingCardHeaderHeadline}
                    >
                      {e.slogan}
                    </motion.div> */}
              {/* </motion.div> */}
              {/* )} */}
              {!matches && (
                <motion.div>
                  <motion.div
                    className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText} ${classes.subscriptionsPricingCardBodySessionPriceContainer}
                    `}
                  >
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionOriginalPriceTextContainer}
                    `}
                    >
                      <motion.div
                        className={`
                      ${
                        e.price.discount_price &&
                        classes.subscriptionsPricingCardBodySessionOriginalPriceStrike
                      }
                    `}
                      >
                        {!e.price.discount_price && (
                          <motion.div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPrice}
                    `}
                          >
                            ${e.price.original_price}
                          </motion.div>
                        )}
                      </motion.div>
                      {e.price.discount_price && (
                        <motion.div
                          className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPrice}
                    `}
                        >
                          ${e.price.discount_price}
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className={
                      classes.subscriptionsPricingCardFooterButtonContainer
                    }
                    onClick={(d) => falseClick(d)}
                  >
                    <NavLink
                      to={e.stripe_link}
                      className={({ isActive }) =>
                        isActive
                          ? `${classes.active} ${
                              classes.subscriptionsPricingCardFooterButton
                            } ${
                              cardFlipState[ind].flipCard &&
                              classes.subscriptionsPricingCardFooterButtonDisabled
                            }`
                          : `${classes.subscriptionsPricingCardFooterButton} ${
                              cardFlipState[ind].flipCard &&
                              classes.subscriptionsPricingCardFooterButtonDisabled
                            }`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {e.cta_button_name}
                    </NavLink>
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
                      {/* <motion.div
                          className={`
                        ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                      `}
                        ></motion.div> */}
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
                                {e.service_length} journey
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
                                Exercise tracking
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
                                Meal planning
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
                                Daily suggestions
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
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText} ${classes.subscriptionsPricingCardBodySessionPriceContainer}
                    `}
                      >
                        {e.price.discount_percent && (
                          <motion.div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPercent}
                    `}
                          >
                            ${e.price.discount_percent}
                          </motion.div>
                        )}

                        <motion.div
                          className={`
                      ${classes.subscriptionsPricingCardBodySessionOriginalPriceTextContainer}
                    `}
                        >
                          <motion.div
                            className={`
                      ${
                        e.price.discount_price &&
                        classes.subscriptionsPricingCardBodySessionOriginalPriceStrike
                      }
                    `}
                          >
                            {!e.price.discount_price && (
                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPrice}
                    `}
                              >
                                ${e.price.original_price}
                              </motion.div>
                            )}
                          </motion.div>
                          {e.price.discount_price && (
                            <motion.div
                              className={`
                      ${classes.subscriptionsPricingCardBodySessionDiscountPrice}
                    `}
                            >
                              ${e.price.discount_price}
                            </motion.div>
                          )}
                        </motion.div>
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
                      {e.service_package}
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
                      Exercise tracking
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
                      Meal planning
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
                      Daily suggestions
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

                  {/* <motion.div
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
                  </motion.div> */}
                </motion.div>
              )}

              {matches && (
                <NavLink
                  to={e.stripe_link}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.active} ${
                          classes.subscriptionsPricingCardFooterButton
                        } ${
                          cardFlipState[ind].flipCard &&
                          classes.subscriptionsPricingCardFooterButtonDisabled
                        }`
                      : `${classes.subscriptionsPricingCardFooterButton} ${
                          cardFlipState[ind].flipCard &&
                          classes.subscriptionsPricingCardFooterButtonDisabled
                        }`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {e.cta_button_name}
                </NavLink>

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
            } ${
              cardFlipState[ind].flipCard &&
              `${classes.subscriptionsPricingCardBack_media_flipped}`
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
                <motion.div onClick={(d) => falseClick(d)}>
                  {/* <motion.div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                    ref={popupRef}
                    onClick={(el, e) => togglePopup(el, e)}
                  >
                    Schedule
                    <motion.img
                      alt="schedule to open pdf popup"
                      src={PopupIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionScheduleIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                  </motion.div> */}
                </motion.div>
              </motion.div>
              <motion.div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoContainer
                }
              >
                <motion.img src="" alt="" />
                {/* <motion.div onClick={(d) => falseClick(d)}>
                  <motion.div
                    className={`${classes.subscriptionsPricingCardBodyExtendedInfoText} ${classes.subscriptionsPricingCardBodyExtendedInfoTextPolicy}`}
                  >
                    Policy
                    <motion.img
                      alt="policy icon to download a pdf"
                      src={DownloadPDF}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionPolicyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                  </motion.div>
                </motion.div> */}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.card>
      </AnimatePresence>
    );
  }
}

export default ServicesStore;
