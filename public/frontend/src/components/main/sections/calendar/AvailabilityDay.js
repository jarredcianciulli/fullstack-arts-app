import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./Calendar.module.css";
import availability_organizationJSON from "../../../data/schedule/availability_organization.json";
import {
  generateTimeSlots,
  timeFormatter,
} from "../../../utils/handlerFactory";

const AvailabilityDay = ({
  selectedDate,
  service_id,
  section_id,
  availability_organization,
  onSelect,
}) => {
  const [AvailabilityUI, setAvailabilityUI] = useState(<>HEJKLKJEl</>);
  const getAvailabilityById = (array, id) => {
    return array.find((obj) => obj.id === id);
  };
  const getAvailabilityByDay = (array, day) => {
    // return array.availability.find((obj) => obj.day === day);
    return array.availability.filter((obj) => obj.day === day);
  };
  const Availability = useRef({});
  const [AvailabilityState, setAvailabilityState] = useState({});
  useEffect(() => {
    let availabilityVariable;
    availabilityVariable = getAvailabilityById(
      availability_organizationJSON.availability_organization,
      availability_organization
    );
    Availability.current = availabilityVariable;
    setAvailabilityState(availabilityVariable);
  }, [selectedDate]);

  useEffect(() => {
    if (Availability.current) {
      let arrayAvail = Availability.current;
      let availabilityByDay = getAvailabilityByDay(
        arrayAvail,
        moment(selectedDate).format("dddd")
      );
      const AvailabilityUIVariable = availabilityByDay.map((e) => {
        const increment = 45; // You can change this to any number of minutes
        const step = 15;
        let timeSlots = generateTimeSlots(e, increment, step);
        timeSlots = timeSlots.map((el, ind) => {
          let startTime;
          let endTime;
          startTime = timeFormatter(el.start_hour, el.start_minutes);
          endTime = timeFormatter(el.end_hour, el.end_minutes);

          return (
            <>
              <motion.div
                className={classes.availability__time}
                key={ind}
                onClick={() => onSelect(startTime)}
                style={{ cursor: "pointer" }}
              >
                <motion.div>{startTime}</motion.div>
                <motion.div>&nbsp;-&nbsp;</motion.div>
                <motion.div>{endTime}</motion.div>
              </motion.div>
            </>
          );
        });
        return timeSlots;
      });
      setAvailabilityUI(AvailabilityUIVariable);
    }
  }, [selectedDate]);

  return (
    <>
      <AnimatePresence>
        <motion.div className={classes.availability}>
          {AvailabilityUI}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AvailabilityDay;
