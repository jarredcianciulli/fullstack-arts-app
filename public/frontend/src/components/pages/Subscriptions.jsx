import CalendarIcon from "./assets/subscriptions/icons/subscription_calendar_icon.svg";
import PolicyIcon from "./assets/subscriptions/icons/subscription_policy_icon.svg";
import ScheduleIcon from "./assets/subscriptions/icons/subscription_schedule_icon.svg";
import TimeIcon from "./assets/subscriptions/icons/subscription_time_icon.svg";
import TimelineIcon from "./assets/subscriptions/icons/subscription_timeline_icon.svg";
import GroupIcon from "./assets/subscriptions/icons/subscription_group_icon.svg";
import AgeGroupIcon from "./assets/subscriptions/icons/subscription_age_group_icon.svg";
// import CalendarIcon from "./assets/subscriptions/icons/subscription_calendar_icon.svg";
import classes from "./Subscriptions.module.css";

function SubscriptionsPage() {
  return (
    <div className={classes.subscriptionsMainContainer}>
      <div className={classes.subscriptionsHeaderContainer}>
        <div className={classes.subscriptionsPricingCardsContainer}>
          <card className={classes.subscriptionsPricingCardContainer}>
            <div className={classes.subscriptionsPricingCardFront}>
              <div className={classes.subscriptionsPricingCardHeader}>
                <div className={classes.subscriptionsPricingCardHeaderTitle}>
                  The Recitalist
                </div>
                <div className={classes.subscriptionsPricingCardHeaderSubject}>
                  Music Fundamentals
                </div>
                <div className={classes.subscriptionsPricingCardHeaderHeadline}>
                  Gamifying Music Education for Kids in a Virtual Group Setting
                </div>
              </div>
              <div
                className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakBody}
                    `}
              ></div>
              <div className={classes.subscriptionsPricingCardBody}>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyPricingContainer
                  }
                >
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyInfoContainer
                    }
                  >
                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoIconContainer
                      }
                    >
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="time icon"
                            src={TimeIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDurationIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDuration} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            45 minutes
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="calendar icon"
                            src={CalendarIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionFrequencyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTiming} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            Weekly
                          </div>
                        </div>
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIcons}
                    `}
                      ></div>
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="verticle timeline icon"
                            src={TimelineIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTimelineIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />

                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            13 sessions
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="group icon"
                            src={GroupIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            0/15 enrolled
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                    `}
                    ></div>
                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoSpecContainer
                      }
                    >
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStart} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        First class of Spring trimester:
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStartValue} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        February 1st, 2024 at 5PM
                      </div>

                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                      >
                        $15/session
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.subscriptionsPricingCardFooter}>
                <button
                  className={classes.subscriptionsPricingCardFooterButton}
                >
                  Register
                </button>
              </div>
            </div>
            <div className={classes.subscriptionsPricingCardBack}>
              <div
                className={
                  classes.subscriptionsPricingCardBodyDescriptionContainer
                }
              >
                <div className={classes.subscriptionsPricingCardBodyPitch}>
                  Introducing our innovative weekly virtual music class that
                  gamifies music education for children of all ages. Our
                  interactive platform combines the joy of gaming with the
                  fundamentals of music theory, providing a fun and engaging
                  learning experience for kids. With our expert instructors and
                  carefully designed curriculum, your child will develop a
                  deeper understanding and appreciation for music in a dynamic
                  and exciting way. Join us as we bring the joy of music to your
                  home!
                </div>
                <div className={classes.subscriptionsPricingCardBodyHighlight}>
                  #virtualgroupmusic #gamingmeetsmusiceducation
                  #allaroundmusicknowledge
                </div>
              </div>
              <div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoSection
                }
              >
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Schedule
                  </div>
                </div>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Policy
                  </div>
                </div>
              </div>
            </div>
          </card>
          <card className={classes.subscriptionsPricingCardContainer}>
            <div className={classes.subscriptionsPricingCardFront}>
              <div className={classes.subscriptionsPricingCardHeader}>
                <div className={classes.subscriptionsPricingCardHeaderTitle}>
                  The Maestro
                </div>
                <div className={classes.subscriptionsPricingCardHeaderSubject}>
                  Music Fundamentals & Viola/Violin Lessons
                </div>
                <div className={classes.subscriptionsPricingCardHeaderHeadline}>
                  Gamifying Music Education for Kids in a Virtual Group Setting
                </div>
              </div>
              <div
                className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakBody}
                    `}
              ></div>
              <div className={classes.subscriptionsPricingCardBody}>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyPricingContainer
                  }
                >
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyInfoContainer
                    }
                  >
                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoIconContainer
                      }
                    >
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="time icon"
                            src={TimeIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDurationIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDuration} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            45 minutes
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="calendar icon"
                            src={CalendarIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionFrequencyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTiming} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            Weekly
                          </div>
                        </div>
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIcons}
                    `}
                      ></div>
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="verticle timeline icon"
                            src={TimelineIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTimelineIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />

                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            13 sessions
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="group icon"
                            src={GroupIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            0/15 enrolled
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                    `}
                    ></div>

                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoSpecContainer
                      }
                    >
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStart} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        First class of Spring trimester:
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStartValue} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        February 1st, 2024 at 5PM
                      </div>

                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                      >
                        $15/session
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.subscriptionsPricingCardFooter}>
                <button
                  className={classes.subscriptionsPricingCardFooterButton}
                >
                  Register
                </button>
              </div>
            </div>
            <div className={classes.subscriptionsPricingCardBack}>
              <div
                className={
                  classes.subscriptionsPricingCardBodyDescriptionContainer
                }
              >
                <div className={classes.subscriptionsPricingCardBodyPitch}>
                  Introducing our innovative weekly virtual music class that
                  gamifies music education for children of all ages. Our
                  interactive platform combines the joy of gaming with the
                  fundamentals of music theory, providing a fun and engaging
                  learning experience for kids. With our expert instructors and
                  carefully designed curriculum, your child will develop a
                  deeper understanding and appreciation for music in a dynamic
                  and exciting way. Join us as we bring the joy of music to your
                  home!
                </div>
                <div className={classes.subscriptionsPricingCardBodyHighlight}>
                  #virtualgroupmusic #gamingmeetsmusiceducation
                  #allaroundmusicknowledge
                </div>
              </div>
              <div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoSection
                }
              >
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Schedule
                  </div>
                </div>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Policy
                  </div>
                </div>
              </div>
            </div>
          </card>

          <card className={classes.subscriptionsPricingCardContainer}>
            <div className={classes.subscriptionsPricingCardFront}>
              <div className={classes.subscriptionsPricingCardHeader}>
                <div className={classes.subscriptionsPricingCardHeaderTitle}>
                  The Soloist
                </div>
                <div className={classes.subscriptionsPricingCardHeaderSubject}>
                  Violin/Viola Lessons
                </div>
                <div className={classes.subscriptionsPricingCardHeaderHeadline}>
                  Gamifying Music Education for Kids in a Virtual Group Setting
                </div>
              </div>
              <div
                className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakBody}
                    `}
              ></div>
              <div className={classes.subscriptionsPricingCardBody}>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyPricingContainer
                  }
                >
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyInfoContainer
                    }
                  >
                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoIconContainer
                      }
                    >
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="time icon"
                            src={TimeIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDurationIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionDuration} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            45 minutes
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="calendar icon"
                            src={CalendarIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionFrequencyIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTiming} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            Weekly
                          </div>
                        </div>
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIcons}
                    `}
                      ></div>
                      <div
                        className={
                          classes.subscriptionsPricingCardBodyInfoIconContainerRow
                        }
                      >
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="verticle timeline icon"
                            src={TimelineIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTimelineIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />

                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionTerm} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            13 sessions
                          </div>
                        </div>
                        <div
                          className={
                            classes.subscriptionsPricingCardBodySessionContainer
                          }
                        >
                          <img
                            alt="group icon"
                            src={GroupIcon}
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionGroupIcon} ${classes.subscriptionsPricingCardBodySessionIcon}
                    `}
                          />
                          <div
                            className={`
                      ${classes.subscriptionsPricingCardBodySessionEnrollment} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                          >
                            1/15 enrolled
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`
                      ${classes.subscriptionsPricingCardBodySessionLineBreak} ${classes.subscriptionsPricingCardBodySessionLineBreakIconsBottom}
                    `}
                    ></div>
                    <div
                      className={
                        classes.subscriptionsPricingCardBodyInfoSpecContainer
                      }
                    >
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStart} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        First class of Spring trimester:
                      </div>
                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionTermStartValue} ${classes.subscriptionsPricingCardBodySessionSpecText}
                    `}
                      >
                        February 1st, 2024 at 5PM
                      </div>

                      <div
                        className={`
                      ${classes.subscriptionsPricingCardBodySessionPrice} ${classes.subscriptionsPricingCardBodySessionText}
                    `}
                      >
                        $15/session
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.subscriptionsPricingCardFooter}>
                <button
                  className={classes.subscriptionsPricingCardFooterButton}
                >
                  Register
                </button>
              </div>
            </div>
            <div className={classes.subscriptionsPricingCardBack}>
              <div
                className={
                  classes.subscriptionsPricingCardBodyDescriptionContainer
                }
              >
                <div className={classes.subscriptionsPricingCardBodyPitch}>
                  Introducing our innovative weekly virtual music class that
                  gamifies music education for children of all ages. Our
                  interactive platform combines the joy of gaming with the
                  fundamentals of music theory, providing a fun and engaging
                  learning experience for kids. With our expert instructors and
                  carefully designed curriculum, your child will develop a
                  deeper understanding and appreciation for music in a dynamic
                  and exciting way. Join us as we bring the joy of music to your
                  home!
                </div>
                <div className={classes.subscriptionsPricingCardBodyHighlight}>
                  #virtualgroupmusic #gamingmeetsmusiceducation
                  #allaroundmusicknowledge
                </div>
              </div>
              <div
                className={
                  classes.subscriptionsPricingCardBodyExtendedInfoSection
                }
              >
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Schedule
                  </div>
                </div>
                <div
                  className={
                    classes.subscriptionsPricingCardBodyExtendedInfoContainer
                  }
                >
                  <img src="" alt="" />
                  <div
                    className={
                      classes.subscriptionsPricingCardBodyExtendedInfoText
                    }
                  >
                    Policy
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsPage;
