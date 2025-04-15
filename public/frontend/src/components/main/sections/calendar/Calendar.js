import { motion, AnimatePresence } from "framer-motion";
import AvailabilityDay from "./AvailabilityDay";
import AvailabilityMonth from "./AvailabilityMonth";
import React, { useState, useRef } from "react";
import ReactCalendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import classes from "./Calendar.module.css";
import "./Calendar.css";

const Calendar = ({
  isOpen,
  handleClose,
  section_id,
  service_id,
  availability_organization,
}) => {
  let CalendarPopup;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState([]);
  const calendarRef = useRef(null);
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
