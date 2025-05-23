import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import clsx from "clsx";
import { formFieldConditionals } from "../../data/form/formFieldConditionals";
import Calendar from "../sections/calendar/Calendar";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import moment from "moment";
import availability_organizationJSON from "../../data/schedule/availability_organization.json";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const ScheduleField = ({
  field,
  formData,
  handleInputChange,
  formFieldOptions,
}) => {
  const { id, field_key, label, required } = field;
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(() => {
    try {
      // Handle the case when schedule_selection is already an array (from URL params)
      if (Array.isArray(formData[field_key])) {
        console.log('[ScheduleField] Using array data directly:', formData[field_key]);
        return formData[field_key];
      }
      // Handle case when it's a JSON string
      else if (formData[field_key]) {
        console.log('[ScheduleField] Parsing JSON string:', formData[field_key]);
        return JSON.parse(formData[field_key]);
      }
      return [];
    } catch (e) {
      console.error('[ScheduleField] Error parsing schedule data:', e);
      return [];
    }
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);

  const handleScheduleSelect = (value) => {
    const selectedOption = formFieldOptions.find((opt) => opt.value === value);

    handleInputChange({
      target: {
        name: field_key,
        value: value,
        type: "schedule",
      },
    });
  };

  const handleRemoveSession = (index) => {
    const newSessions = [...selectedSessions];
    newSessions.splice(index, 1);
    setSelectedSessions(newSessions);

    handleInputChange({
      target: {
        name: field_key,
        value: JSON.stringify(newSessions),
        type: "schedule",
      },
    });
  };

  const handleEditSession = (index) => {
    setEditingSessionIndex(index);
    setIsCalendarOpen(true);
  };

  const handleCalendarEditSelect = ({ day, time, date }) => {
    if (editingSessionIndex !== null) {
      const newSessions = [...selectedSessions];
      newSessions[editingSessionIndex] = { day, time, date };
      setSelectedSessions(newSessions);
      setEditingSessionIndex(null);
      setIsCalendarOpen(false);

      handleInputChange({
        target: {
          name: field_key,
          value: JSON.stringify(newSessions),
          type: "schedule",
        },
      });
    }
  };

  // Get total sessions from formData.schedule_sessions (set by FormField when selecting a package)
  const totalSessions = formData.schedule_sessions || 1;

  const handleCalendarSelect = ({ day, time, date }) => {
    const packageSessions = totalSessions;
    if (isPickerMode && selectedSessions.length >= packageSessions) {
      alert(
        `You can only select ${packageSessions} session${
          packageSessions > 1 ? "s" : ""
        } with this package.`
      );
      return;
    }

    const newSessions = [...selectedSessions];
    newSessions.push({ day, time, date });
    setSelectedSessions(newSessions);
    setIsCalendarOpen(false);

    handleInputChange({
      target: {
        name: field_key,
        value: JSON.stringify(newSessions),
        type: "schedule",
      },
    });
  };

  const isPickerMode = field.input_scope === "picker";

  // Get availability data
  const organizationId = field.availableOrganizations || 1;
  const organization =
    availability_organizationJSON.availability_organization.find(
      (org) => org.id === organizationId
    );

  // Get available days and times
  const availableDays =
    organization?.availability.map((slot) => slot.day) || [];

  const getAvailableTimeSlots = (day) => {
    const daySlot = organization?.availability.find((slot) => slot.day === day);
    if (!daySlot) return [];

    const times = [];
    let currentTime = moment().set({
      hour: daySlot.start_hour,
      minute: daySlot.start_minutes,
    });
    const endTime = moment().set({
      hour: daySlot.end_hour,
      minute: daySlot.end_minutes,
    });

    while (currentTime.isSameOrBefore(endTime)) {
      const timeStr = currentTime.format("h:mm A");
      // Only add the time if it's not already selected for this day
      if (!selectedSessions.some(session => 
        session.day === day && session.time === timeStr
      )) {
        times.push(timeStr);
      }
      currentTime.add(daySlot.interval_minutes, "minutes");
    }

    return times;
  };

  const getAvailableTimesForDay = (day) => {
    console.log('Getting times for day:', day);
    const daySlot = organization?.availability.find((slot) => slot.day === day);
    console.log('Found day slot:', daySlot);
    if (!daySlot) return [];

    const times = [];
    let currentTime = moment().set({
      hour: daySlot.start_hour,
      minute: daySlot.start_minutes,
    });
    const endTime = moment().set({
      hour: daySlot.end_hour,
      minute: daySlot.end_minutes,
    });

    console.log('Start time:', currentTime.format('h:mm A'));
    console.log('End time:', endTime.format('h:mm A'));

    const intervalMinutes = organization?.start_time_increments_minutes || 30;
    console.log('Interval minutes:', intervalMinutes);

    while (currentTime.isSameOrBefore(endTime)) {
      times.push(currentTime.format("h:mm A"));
      currentTime.add(intervalMinutes, "minutes");
    }

    console.log('Available times:', times);
    return times;
  };

  const generateRecurringSessions = () => {
    if (
      !selectedDay ||
      !selectedTime ||
      !startDate ||
      !formData.preferred_cadence
    )
      return;

    const frequency = formData.preferred_cadence;
    const sessions = formData.sessions || 1;
    const result = [];
    let currentDate = moment(startDate);

    for (let i = 0; i < sessions; i++) {
      result.push({
        day: currentDate.format("dddd"),
        date: currentDate.format("YYYY-MM-DD"),
        time: selectedTime,
      });

      if (frequency === "Weekly") {
        currentDate.add(1, "week");
      } else if (frequency === "Bi-weekly") {
        currentDate.add(2, "weeks");
      }
    }

    setSelectedSessions(result);
    handleInputChange({
      target: {
        name: field_key,
        value: JSON.stringify(result),
        type: "schedule",
      },
    });
  };

  return (
    <div className={styles.schedule_field_container}>
      <div className={styles.schedule_options_display}>
        {isPickerMode ? (
          <div className={styles.schedule_picker_container}>
            <div className={styles.calendar_header}>
              <button
                type="button"
                className={clsx(styles.calendar_button, {
                  [styles.disabled]:
                    isPickerMode && selectedSessions.length >= totalSessions,
                })}
                onClick={() => {
                  if (
                    isPickerMode &&
                    selectedSessions.length >= totalSessions
                  ) {
                    return;
                  }
                  setEditingSessionIndex(null);
                  setIsCalendarOpen(true);
                }}
              >
                <FaCalendarAlt /> Select Date & Time
              </button>
              {isPickerMode && (
                <div className={styles.sessions_counter}>
                  {selectedSessions.length} / {totalSessions} Sessions
                </div>
              )}
            </div>

            {selectedSessions.length > 0 && (
              <div className={styles.sessions_table}>
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSessions.map((session, index) => (
                      <tr key={index}>
                        <td>
                          {isPickerMode
                            ? moment(session.date).format("MMMM D, YYYY")
                            : session.day}
                        </td>
                        <td>{session.time}</td>
                        <td>
                          <div className={styles.session_actions}>
                            <button
                              type="button"
                              className={styles.edit_session_button}
                              onClick={() => handleEditSession(index)}
                            >
                              <FaCalendarAlt />
                            </button>
                            <button
                              type="button"
                              className={styles.remove_session_button}
                              onClick={() => handleRemoveSession(index)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Calendar
              isOpen={isCalendarOpen}
              handleClose={() => {
                setIsCalendarOpen(false);
                setEditingSessionIndex(null);
              }}
              onSelect={
                editingSessionIndex !== null
                  ? handleCalendarEditSelect
                  : handleCalendarSelect
              }
              availability_organization={field.availableOrganizations || 1}
            />
          </div>
        ) : (
          <div className={styles.schedule_selector_container}>
            <div className={styles.selector_section}>
              <div className={styles.selector_title}>Day</div>
              <div className={styles.days_grid}>
                {availableDays.map((day) => (
                  <div
                    key={day}
                    className={clsx(styles.day_card, {
                      [styles.selected]: selectedDay === day,
                    })}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className={styles.selector_section}>
                <div className={styles.selector_title}>Time</div>
                <div className={styles.times_grid}>
                  {getAvailableTimesForDay(selectedDay).map((time) => (
                    <div
                      key={time}
                      className={clsx(styles.time_card, {
                        [styles.selected]: selectedTime === time,
                      })}
                      onClick={() => {
                        setSelectedTime(time);
                        generateRecurringSessions();
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSessions.length > 0 && (
              <div className={styles.sessions_table}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSessions.map((session, index) => (
                      <tr key={index}>
                        <td>{session.date}</td>
                        <td>{session.day}</td>
                        <td>{session.time}</td>
                        <td>
                          <div className={styles.session_actions}>
                            <button
                              type="button"
                              className={styles.edit_session_button}
                              onClick={() => handleEditSession(index)}
                            >
                              <FaCalendarAlt />
                            </button>
                            <button
                              type="button"
                              className={styles.remove_session_button}
                              onClick={() => handleRemoveSession(index)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ScheduleField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number.isRequired,
    field_key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    input_scope: PropTypes.oneOf(["selector", "picker"]),
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
};

export default ScheduleField;
