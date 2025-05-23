import { useState, useEffect, useRef } from "react";
import classes from "./Services.module.css";
import { PopupButton } from "react-calendly";
import { useNavigate } from "react-router-dom";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import CalendarIcon from "../../../pages/assets/subscriptions/icons/subscription_calendar_icon.svg";
import PolicyIcon from "../../../pages/assets/subscriptions/icons/subscription_policy_icon.svg";
import ScheduleIcon from "../../../pages/assets/subscriptions/icons/subscription_schedule_icon.svg";
import TimeIcon from "../../../pages/assets/subscriptions/icons/subscription_time_icon.svg";
import TimelineIcon from "../../../pages/assets/subscriptions/icons/subscription_timeline_icon.svg";
import GroupIcon from "../../../pages/assets/subscriptions/icons/subscription_group_icon.svg";
import AgeGroupIcon from "../../../pages/assets/subscriptions/icons/subscription_age_group_icon.svg";
import DownloadPDF from "../../../pages/assets/download_pdf.svg";
import PopupIcon from "../../../pages/assets/popup_icon.svg";

import useMediaQuery from "../../../utils/UI/UseMediaQuery";
import Calendar from "../calendar/Calendar";
import FormStore from "../../registration/FormStore";
import MultiStepForm from "../../form/MultiStepForm";
//JSON
import ServicesJSON from "../../../data/services.json";

function ServicesComponent({ id, e, prop, ind, onServiceClick }) {
  const [isAPopupOpen, setIsAPopupOpen] = useState(false);
  const matches = useMediaQuery("(min-width: 800px)"); // Use the custom hook
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const fieldStateContent = [];
  const fieldStateContentMap = ServicesJSON.services.map((field) => {
    fieldStateContent.push({ flipCard: false, animatingFlipCard: false });
  });

  const [cardFlipState, setCardFlipState] = useState(fieldStateContent);

  function matchMedia(c, e) {
    return {
      opacity: 1,
      rotateY: c.flipCard ? 180 : 0,
    };
  }

  function handleRegistrationClick(service) {
    // setSelectedService(service);
    setIsFormOpen(true);
    if (onServiceClick) {
      onServiceClick(service);
    }
    console.log(service);
    navigate(`${service.slug}/register`);
  }

  function notMatchMedia(e) {
    return {
      opacity: 1,
      rotateX: cardFlipState[e].flipCard ? 180 : 0,
      rotateY: cardFlipState[e].flipCard ? 0 : 0,
    };
  }

  function flipCard(e, cardIndex) {
    if (isAPopupOpen) return;

    const updatedArray = cardFlipState.map((card, index) =>
      index === cardIndex ? { ...card, flipCard: !card.flipCard } : card
    );

    setCardFlipState(updatedArray);
  }

  const togglePopup = () => {
    setIsAPopupOpen((prev) => !prev);
    setIsPopupOpen((prev) => !prev); // consider removing one of these
  };

  const closePopup = () => {
    setIsAPopupOpen(false);
    setIsPopupOpen(false);
  };

  function mediaChangeListener(ind) {
    return {
      opacity: 1,
      rotateX: 0,
      rotateY: cardFlipState[ind].flipCard ? 180 : 0,
    };
  }

  function smallMediaChangeListener(ind) {
    return {
      opacity: 1,
      rotateX: cardFlipState[ind].flipCard ? 180 : 0,
      rotateY: 0,
    };
  }

  //   const homeCardOptions = ServicesJSON.services.map((e, ind) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  const ref = useRef([]);
  const refButton = useRef();
  function falseClick(e) {
    e.stopPropagation();
  }

  const handleCalendarTimeSelect = (selectedTimeData) => {
    // Close the calendar popup
    setIsAPopupOpen(false);

    setIsPopupOpen(false);

    // Perform the registration click action
    // 'e' should be the service data associated with this specific ServicesComponent instance
    handleRegistrationClick(e);
    console.log(
      "Calendar time selected, form should open for:",
      e,
      selectedTimeData
    );
  };

  if (prop.id == e.section) {
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
      <AnimatePresence mode="wait">
        {isPopupOpen && (
          <Calendar
            isOpen={isPopupOpen}
            handleClose={closePopup}
            section_id={e.id} // Assuming e.id is the correct section_id
            service_id={e.service_id} // Assuming e.service_id is correct
            availability_organization={e.availability_organization} // Assuming this is correct
            onSelect={handleCalendarTimeSelect} // Pass the new handler here
            initialDay={e.initial_day} // Assuming e.initial_day or similar exists
          />
        )}
        {selectedService && (
          <MultiStepForm
            service={selectedService}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
          />
        )}
        <motion.div
          key={`service-${e.id}`}
          className={classes.subscriptionsPricingCardContainer}
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
                {prop.specification}
              </motion.div>
              <motion.div
                className={classes.subscriptionsPricingCardHeaderInstrument}
              >
                {Instrument}
              </motion.div>
              {matches ? (
                <>
                  <motion.div
                    className={classes.subscriptionsPricingCardHeaderLocation}
                  >
                    Location:
                  </motion.div>

                  <motion.div
                    className={
                      classes.subscriptionsPricingCardHeaderLocationPropertyContainer
                    }
                  >
                    <motion.div
                      className={
                        classes.subscriptionsPricingCardHeaderLocationProperty
                      }
                    >
                      {e.service_location_property}
                    </motion.div>
                  </motion.div>
                </>
              ) : null}
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
                    <motion.div
                      className={
                        classes.subscriptionsPricingCardHeaderLocationContainerSmall
                      }
                    >
                      <motion.div
                        className={
                          classes.subscriptionsPricingCardHeaderLocationSmall
                        }
                      >
                        Location:
                      </motion.div>
                      <motion.div
                        className={
                          classes.subscriptionsPricingCardHeaderLocationPropertyContainer
                        }
                      >
                        <motion.div
                          className={
                            classes.subscriptionsPricingCardHeaderLocationPropertySmall
                          }
                        >
                          {e.service_location_property}
                        </motion.div>
                      </motion.div>
                    </motion.div>
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
                                {Duration}
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
                                    e.frequency.frequency_max
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
                                alt="group icon"
                                src={GroupIcon}
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                              />

                              <motion.div
                                className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                              >
                                {e.instructor}
                              </motion.div>
                            </motion.div>
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
                      {Duration}
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
                          e.frequency.frequency_max
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
                      alt="group icon"
                      src={GroupIcon}
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                    />
                    <motion.div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {e.instructor}
                    </motion.div>
                  </motion.div>
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
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                    >
                      {e.student_count == 1 ? "1:1 sessions" : e.student_count}
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
                    <div
                      className={`${
                        classes.subscriptionsPricingCardFooterButton
                      } ${
                        cardFlipState[ind].flipCard &&
                        classes.subscriptionsPricingCardFooterButtonDisabled
                      }`}
                      onClick={() => handleRegistrationClick(e)}
                    >
                      {e.cta_button_name}
                    </div>
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
                  <div
                    className={`${
                      classes.subscriptionsPricingCardFooterButton
                    } ${
                      cardFlipState[ind].flipCard &&
                      classes.subscriptionsPricingCardFooterButtonDisabled
                    }`}
                    onClick={() => handleRegistrationClick(e)}
                  >
                    {e.cta_button_name}
                  </div>
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
                <motion.div onClick={(d) => falseClick(d)}>
                  <motion.div
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
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoContainer
                }
              >
                <motion.img src="" alt="" />
                <motion.div onClick={(d) => falseClick(d)}>
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
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
}

export default ServicesComponent;
