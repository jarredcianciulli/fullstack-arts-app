import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./Calendar.module.css";
import availability_organizationJSON from "../../../data/schedule/availability_organization.json";
import {
  generateTimeSlots,
  timeFormatter,
} from "../../../utils/handlerFactory";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AvailabilityDay = ({
  selectedDate,
  service_id,
  section_id,
  availability_organization,
  onSelect,
}) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);

  const getAvailabilityById = (array, id) => {
    return array.find((obj) => obj.id === id);
  };

  const getAvailabilityByDay = (array, day) => {
    return array.availability.filter((obj) => obj.day === day);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      const date = moment(selectedDate).format("YYYY-MM-DD");
      console.log("Fetching availability for date:", date);
      try {
        console.log("Checking availability for date:", date);
        const response = await fetch(
          `${API_BASE_URL}/api/availability/check-date/${date}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw response data:", data);

        // The backend already sends us formatted HH:mm times
        const { busySlots } = data;
        console.log("Busy slots from backend:", busySlots);

        if (!Array.isArray(busySlots)) {
          console.error(
            "Expected busySlots to be an array, got:",
            typeof busySlots
          );
          setBusyTimes([]);
          return;
        }

        setBusyTimes(busySlots);

        // Get organization's availability for this day
        const org = getAvailabilityById(
          availability_organizationJSON.availability_organization,
          availability_organization
        );

        if (!org) {
          console.error("Organization not found");
          return;
        }

        const dayAvailability = getAvailabilityByDay(
          org,
          moment(selectedDate).format("dddd")
        );

        // Generate time slots for each availability window
        const allTimeSlots = dayAvailability.flatMap((window) => {
          const increment = 45; // 45 minute sessions
          const step = 15; // 15 minute intervals
          return generateTimeSlots(window, increment, step);
        });

        setAvailableTimeSlots(allTimeSlots);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailableTimeSlots([]);
      }
    };

    fetchAvailability();
  }, [selectedDate, availability_organization]);

  const renderTimeSlots = () => {
    return availableTimeSlots.map((slot) => {
      const startTime = timeFormatter(slot.start_hour, slot.start_minutes);
      const endTime = timeFormatter(slot.end_hour, slot.end_minutes);
      const timeSlotId = `${moment(selectedDate).format(
        "YYYY-MM-DD"
      )}-${startTime}`;
      // Check if this time slot overlaps with any busy period
      const isBooked = busyTimes.some((busySlot) => {
        console.log(
          "Checking slot:",
          startTime,
          "against busy slot:",
          busySlot
        );

        // Convert time strings to 24-hour format for comparison
        const slotTime = moment(startTime, ["h:mma", "H:mm"]).format("HH:mm");
        const [slotHours, slotMinutes] = slotTime.split(":").map(Number);
        const slotMinutesTotal = slotHours * 60 + slotMinutes;

        // Parse busy slot times (already in 24-hour format)
        const [busyStartHours, busyStartMinutes] = busySlot.start
          .split(":")
          .map(Number);
        const [busyEndHours, busyEndMinutes] = busySlot.end
          .split(":")
          .map(Number);
        const busyStartMinutesTotal = busyStartHours * 60 + busyStartMinutes;
        const busyEndMinutesTotal = busyEndHours * 60 + busyEndMinutes;

        console.log("Comparing times (in minutes):", {
          slotTime: slotTime,
          slotMinutes: slotMinutesTotal,
          busyStart: busyStartMinutesTotal,
          busyEnd: busyEndMinutesTotal,
        });

        // Check if slot start time falls within busy period
        const isWithinBusyPeriod =
          slotMinutesTotal >= busyStartMinutesTotal &&
          slotMinutesTotal < busyEndMinutesTotal;

        if (isWithinBusyPeriod) {
          console.log(
            `BUSY: ${startTime} falls within busy period ${busySlot.start}-${busySlot.end}`
          );
        }

        return isWithinBusyPeriod;
      });

      return (
        <motion.div
          key={timeSlotId}
          className={`${classes.availability__time} ${
            isBooked ? classes.booked : ""
          }`}
          onClick={() => !isBooked && onSelect(startTime)}
          style={{ cursor: isBooked ? "not-allowed" : "pointer" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div>{startTime}</motion.div>
          <motion.div>&nbsp;-&nbsp;</motion.div>
          <motion.div>{endTime}</motion.div>
          {isBooked && <div className={classes.booked_label}>Booked</div>}
        </motion.div>
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div className={classes.availability}>
        {renderTimeSlots()}
      </motion.div>
    </AnimatePresence>
  );
};

export default AvailabilityDay;
