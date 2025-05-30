import { motion, AnimatePresence } from "framer-motion";
import AvailabilityDay from "./AvailabilityDay";
import AvailabilityMonth from "./AvailabilityMonth";
import React, { useState, useRef, useEffect } from "react";
import ReactCalendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import classes from "./Calendar.module.css";
import "./Calendar.css";
import availability_organizationJSON from "../../../data/schedule/availability_organization.json";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Calendar = ({
  isOpen,
  handleClose,
  section_id,
  service_id,
  availability_organization,
  onSelect,
  initialDay,
  initialTime,
  initialDate,
}) => {
  let CalendarPopup;

  // Add debug log when initialDate is provided
  if (initialDate) {
    console.log('Calendar received initialDate:', initialDate);
  }

  const [selectedDate, setSelectedDate] = useState(() => {
    // If initialDate is provided (when editing a session), use it directly
    if (initialDate) {
      console.log('Setting Calendar date to:', moment(initialDate).format('YYYY-MM-DD'));
      return moment(initialDate).toDate();
    }
    // Otherwise, if initialDay is provided, calculate the date
    else if (initialDay) {
      // Convert day name to date
      const today = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDayIndex = today.getDay();
      const targetDayIndex = days.indexOf(initialDay);
      const daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      return targetDate;
    }
    return new Date();
  });
  const [visibleDates, setVisibleDates] = useState([]);
  const calendarRef = useRef(null);

  const [disabledDates, setDisabledDates] = useState(new Set());

  useEffect(() => {
    // Check availability for visible dates
    const checkAvailability = async (dates) => {
      try {
        const promises = dates.map(async (date) => {
          const formattedDate = moment(date).format("YYYY-MM-DD");
          const response = await fetch(
            `${API_BASE_URL}/api/availability/check-date/${formattedDate}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const { busySlots } = await response.json();
          return { date: formattedDate, isBusy: busySlots.length === 24 }; // If all slots are busy
        });

        const results = await Promise.all(promises);
        const newDisabledDates = new Set(
          results.filter((result) => result.isBusy).map((result) => result.date)
        );
        setDisabledDates(newDisabledDates);
      } catch (error) {
        console.error("Error checking availability:", error);
      }
    };

    if (visibleDates.length > 0) {
      checkAvailability(visibleDates);
    }
  }, [visibleDates]);

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;

    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check if date is in disabled dates
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (disabledDates.has(formattedDate)) return true;

    // Check if day has any availability in organization data
    const dayName = moment(date).format("dddd");
    const org = availability_organizationJSON.availability_organization.find(
      (org) => org.id === availability_organization
    );

    if (!org) return true;

    const dayAvailability = org.availability.find(
      (slot) => slot.day === dayName
    );
    return !dayAvailability; // disable if no availability found for this day
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const tileClassName = ({ date, view }) => {
    // Add class to weekends
    if (view === "month") {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return "weekend";
      }
    }

    // Add class to holidays (example: New Year's Day)
    if (moment(date).isSame("2024-01-01", "day")) {
      return "holiday";
    }

    return null;
  };

  const generateDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view === "month") {
      const start = new Date(activeStartDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);

      const datesInRange = generateDatesInRange(start, end);
      setVisibleDates(datesInRange);
    }
  };
  const handleBackToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    calendarRef.current.setActiveStartDate(today);
    // onDateChange(moment(today).format("YYYY-MM-DD"));
  };

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };

  useEffect(() => {
    const scrollPosition = window.pageYOffset;
    if (isOpen) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.bottom = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.bottom = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.bottom = "";
      document.body.style.width = "";
      if (isOpen) {
        window.scrollTo(0, scrollPosition);
      }
    };
  }, [isOpen]);
  if (!isOpen) return null;
  if (isOpen) {
    {
      CalendarPopup = (
        <AnimatePresence transition={transition_text} exit={{ opacity: 0 }}>
          <motion.div
            className={classes.popupOverlay}
            initial={{ opacity: 0 }}
            transition={transition_text}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className={classes.popupContent}>
              <motion.button
                className={classes.popupClose}
                onClick={handleClose}
              >
                &times;
              </motion.button>
              <ReactCalendar
                onChange={handleDateChange}
                value={selectedDate}
                ref={calendarRef}
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                onActiveStartDateChange={handleActiveStartDateChange}
              />

              <div className={classes.calendarActionsContainer}>
                <button
                  onClick={handleBackToToday}
                  className={classes.backToTodayBtn}
                >
                  Back to Today
                </button>
                <div className={classes.selectedDate}>
                  Selected Date:
                  <div className={classes.selectedDateSpec}>
                    {moment(selectedDate).format("MM-DD-YYYY")}
                  </div>
                </div>
                <AvailabilityDay
                  selectedDate={selectedDate}
                  service_id={service_id}
                  section_id={section_id}
                  availability_organization={availability_organization}
                  initialTime={initialTime}
                  initialDate={initialDate}
                  onSelect={(time) => {
                    const day = moment(selectedDate).format("dddd");
                    const date = moment(selectedDate).format("YYYY-MM-DD");
                    onSelect({ day, time, date });
                    handleClose();
                  }}
                />
                <AvailabilityMonth visibleDates={visibleDates} />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }
  }

  return <> {CalendarPopup} </>;
};

export default Calendar;
