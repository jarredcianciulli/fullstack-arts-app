import { motion, AnimatePresence } from "framer-motion";
import AvailabilityDay from "./AvailabilityDay";
import AvailabilityMonth from "./AvailabilityMonth";
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import ReactCalendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import classes from "./Calendar.module.css";
import "./Calendar.css";
import availability_organizationJSON from "../../../data/schedule/availability_organization.json";

const Calendar = ({
  isOpen,
  handleClose,
  section_id,
  service_id,
  availability_organization,
  onSelect,
  initialDay,
}) => {
  let CalendarPopup;

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDay) {
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
  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;

    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Get organization by ID (same as in AvailabilityDay)
    const org = availability_organizationJSON.availability_organization.find(
      (obj) => obj.id === availability_organization
    );
    if (!org?.availability) return true;

    // Check if this day has any time slots
    const dayName = moment(date).format('dddd');
    return !org.availability.some(slot => slot.day === dayName);
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
                  onSelect={(time) => {
                    const day = moment(selectedDate).format("dddd");
                    onSelect({ day, time });
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

  return ReactDOM.createPortal(
    CalendarPopup,
    document.getElementById('calendar-portal')
  );
};

export default Calendar;
