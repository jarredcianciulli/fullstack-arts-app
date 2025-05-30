import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import clsx from "clsx";
import { formFieldConditionals } from "../../data/form/formFieldConditionals";
import Calendar from "../sections/calendar/Calendar";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import moment from "moment";
import availability_organizationJSON from "../../data/schedule/availability_organization.json";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const ScheduleFieldDep = ({
  field,
  formData,
  handleInputChange,
  formFieldOptions,
  validationErrors,
}) => {
  // Provide defaults for required props to prevent warnings
  const { id, field_key, label = "Schedule", required = false } = field || {};

  // Simple state management
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const sessionsRef = useRef([]);
  const [currentCadence, setCurrentCadence] = useState("Weekly");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [unavailableSessionsCount, setUnavailableSessionsCount] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update ref when sessions change
  const updateSessions = useCallback((newSessions) => {
    sessionsRef.current = Array.isArray(newSessions) ? [...newSessions] : [];
    setSessions(sessionsRef.current);
  }, []);
  const sessionsRef = useRef([]);
  const [sessions, _setSessions] = useState(() => {
    try {
      if (Array.isArray(formData[field_key])) {
        return formData[field_key];
      } else if (
        formData[field_key] &&
        typeof formData[field_key] === "string"
      ) {
        const value = formData[field_key].trim();
        if (
          (value.startsWith("[") && value.endsWith("]")) ||
          (value.startsWith("{") && value.endsWith("}"))
        ) {
          return JSON.parse(formData[field_key]);
        }
      }
      return [];
    } catch (e) {
      console.error("Error parsing sessions:", e);
      return [];
    }
  });

  // Function to get current and total session counts
  const getSessionCount = () => {
    const packageSessions = formData?.package_selection
      ? parseInt(formData.package_selection.split("_").pop(), 10) || 5
      : 5; // Default to 5 if no package selected

    return {
      current: sessions.length,
      total: packageSessions,
    };
  };

  const { current: currentSessions, total: maxSessions } = getSessionCount();

  // Wrapper function to update both ref and state for sessions
  const updateSessions = (newSessions) => {
    const updatedSessions = Array.isArray(newSessions) ? [...newSessions] : [];
    sessionsRef.current = updatedSessions;
    _setSessions(updatedSessions);

    // Update the form data
    handleInputChange({
      target: {
        name: field_key,
        value: JSON.stringify(updatedSessions),
        type: "schedule",
      },
    });
  };

  // Track current cadence - use ref to track without re-renders
  const [currentCadence, setCurrentCadence] = useState(() => {
    return formData?.preferred_cadence || "Weekly";
  });

  // Track cadence changes with ref to prevent unnecessary re-renders
  const cadenceRef = useRef(currentCadence);

  // Update ref when currentCadence changes
  useEffect(() => {
    cadenceRef.current = currentCadence;
  }, [currentCadence]);

  // Handle cadence initialization and updates from props
  useEffect(() => {
    // Only update if the prop value is different from our current ref
    if (
      formData?.preferred_cadence &&
      formData.preferred_cadence !== cadenceRef.current
    ) {
      const newCadence = formData.preferred_cadence;
      cadenceRef.current = newCadence;
      setCurrentCadence(newCadence);
    }

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [formData?.preferred_cadence]);

  // Alias sessions as selectedSessions for compatibility with existing code
  const selectedSessions = sessions;
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);
  // Add state for tracking unavailable sessions
  const [unavailableSessionsCount, setUnavailableSessionsCount] = useState(0);
  const [totalRequiredSessions, setTotalRequiredSessions] = useState(5); // Default to 5 sessions
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScheduleSelect = useCallback(
    (value) => {
      // Prevent processing if value hasn't changed
      if (value === previousCadence.current) return;

      console.log(`Cadence changed to ${value}`);

      // Update the ref first to track the current value
      previousCadence.current = value;

      // Batch all state updates together
      const update = () => {
        // Clear all related state
        updateSessions([]);
        setSelectedDay(null);
        setSelectedTime(null);
        setUnavailableDates([]);
        setUnavailableSessionsCount(0);

        // Update form data in a single operation
        handleInputChange({
          target: {
            name: field_key,
            value: value,
            type: "schedule",
          },
        });

        // Update the cadence state
        setCurrentCadence(value);

        // Clear schedule selection in the next tick
        setTimeout(() => {
          handleInputChange({
            target: {
              name: "schedule_selection",
              value: JSON.stringify([]),
              type: "schedule",
            },
          });
        }, 0);
      };

      // Execute the update
      update();
    },
    [field_key]
  ); // Only recreate if field_key changes

  const handleRemoveSession = (index) => {
    if (index >= 0 && index < sessions.length) {
      const newSessions = [...sessions];
      newSessions.splice(index, 1);
      updateSessions(newSessions);
    }
  };

  const handleEditSession = (index) => {
    setEditingSessionIndex(index);
    setIsCalendarOpen(true);
  };

  const handleCalendarEditSelect = ({ day, time, date }) => {
    if (editingSessionIndex !== null) {
      console.log("Editing session with new values:", {
        day,
        time,
        date,
        editingSessionIndex,
      });

      const newSessions = [...selectedSessions];
      newSessions[editingSessionIndex] = { day, time, date };

      console.log("Updated sessions:", newSessions);

      updateSessions(newSessions);
      setEditingSessionIndex(null);
      setIsCalendarOpen(false);

      handleInputChange({
        target: {
          name: "schedule_selection", // Use consistent field name for weekly/bi-weekly
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
    updateSessions(newSessions);
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
      if (
        !selectedSessions.some(
          (session) => session.day === day && session.time === timeStr
        )
      ) {
        times.push(timeStr);
      }
      currentTime.add(daySlot.interval_minutes, "minutes");
    }

    return times;
  };

  const getAvailableTimesForDay = (day) => {
    console.log("Getting times for day:", day);
    const daySlot = organization?.availability.find((slot) => slot.day === day);
    console.log("Found day slot:", daySlot);
    if (!daySlot) return [];

    // Get service duration information
    let serviceDuration = 45; // Default to 45 minutes if not specified
    if (formData.service_id) {
      try {
        const serviceData = JSON.parse(formData.service_data || "{}");
        if (serviceData.duration && serviceData.duration.mins) {
          serviceDuration = parseInt(serviceData.duration.mins);
          console.log(
            "Using service duration from service_data:",
            serviceDuration
          );
        } else if (formData.duration_mins) {
          serviceDuration = parseInt(formData.duration_mins);
          console.log(
            "Using service duration from formData.duration_mins:",
            serviceDuration
          );
        }
      } catch (e) {
        console.error("Error parsing service data:", e);
      }
    }

    // Set up start and end times
    let currentTime = moment().set({
      hour: daySlot.start_hour,
      minute: daySlot.start_minutes,
    });
    const endTime = moment().set({
      hour: daySlot.end_hour,
      minute: daySlot.end_minutes,
    });

    console.log("Start time:", currentTime.format("h:mm A"));
    console.log("End time:", endTime.format("h:mm A"));
    console.log("Service duration (minutes):", serviceDuration);

    // Get the time increment from organization data
    const incrementMinutes = organization?.start_time_increments_minutes || 30;
    console.log("Time increment (minutes):", incrementMinutes);

    // For debugging
    console.log(
      `Checking availability for ${day} - Current day: ${moment().format(
        "dddd"
      )} (${moment().format("YYYY-MM-DD")})`
    );

    const times = [];
    // Calculate the last possible start time (allowing for the service duration)
    const lastPossibleStartTime = moment(endTime).subtract(
      serviceDuration,
      "minutes"
    );
    console.log(
      `Last possible start time: ${lastPossibleStartTime.format("h:mm A")}`
    );

    // Generate available times in increments
    console.log(
      `Generating time slots from ${currentTime.format(
        "h:mm A"
      )} to ${lastPossibleStartTime.format(
        "h:mm A"
      )} in ${incrementMinutes}-minute increments`
    );

    // Today's checks
    const today = moment().format("dddd");
    const now = moment();
    const isTodayCheck = today === day;
    console.log(
      `Is today (${today}) the selected day (${day})? ${isTodayCheck}`
    );

    // Special handling for Tuesday (regardless of cadence)
    let filteredOutCount = 0;
    let includedCount = 0;

    while (currentTime.isSameOrBefore(lastPossibleStartTime)) {
      const timeStr = currentTime.format("h:mm A");
      let shouldSkip = false;

      // We only need to check if this is today for logging purposes
      if (today === day) {
        // Create a moment that represents today at the current time slot
        const todayAtTime = moment();
        todayAtTime.set({
          hour: currentTime.hours(),
          minute: currentTime.minutes(),
          second: 0,
          millisecond: 0,
        });

        const hoursFromNow = todayAtTime.diff(now, "hours", true);
        console.log(
          `Time ${timeStr} is ${hoursFromNow.toFixed(2)} hours from now`
        );

        // We include ALL times in the UI regardless of minimum notice period
        // Minimum notice hours are only checked during session generation
        console.log(`Including time ${timeStr} in available times for UI`);
        shouldSkip = false;
      }

      if (!shouldSkip) {
        // Add this time to available times
        times.push(timeStr);
        includedCount++;
      }

      currentTime.add(incrementMinutes, "minutes");
    }

    console.log(
      `Times filtered out: ${filteredOutCount}, Times included: ${includedCount}`
    );

    console.log(`Available times for ${day} after filtering:`, times);
    return times;
  };

  const handleEditSessionCadence = (index) => {
    // Store the index in state rather than window for better integration
    console.log("Editing session at index:", index);

    // Make sure the edited session is stored properly for reference
    const sessionToEdit = selectedSessions[index];

    // Set these values to prepare the calendar
    setSelectedDay(sessionToEdit.day);
    setSelectedTime(sessionToEdit.time);

    // Use the existing edit session function which works correctly
    setEditingSessionIndex(index);
    setIsCalendarOpen(true);
  };

  const handleRemoveSessionCadence = (index) => {
    console.log("Removing session at index:", index);

    // Validate the index and sessions array
    if (
      !selectedSessions ||
      !Array.isArray(selectedSessions) ||
      index < 0 ||
      index >= selectedSessions.length
    ) {
      console.error(
        "Invalid session index for removal:",
        index,
        selectedSessions?.length
      );
      return;
    }

    // Create a new array without the removed session
    const updatedSessions = selectedSessions.filter((_, i) => i !== index);
    console.log("Updated sessions after removal:", updatedSessions);

    // Update state
    updateSessions(updatedSessions);

    // If no sessions left, clear day and time selection
    if (updatedSessions.length === 0) {
      setSelectedDay(null);
      setSelectedTime(null);
    }

    // Update form data with specific field_key
    handleInputChange({
      target: {
        name: "schedule_selection", // Use schedule_selection to prevent affecting cadence
        value: JSON.stringify(updatedSessions),
        type: "schedule",
      },
    });
  };

  const generateRecurringSessions = async () => {
    if (!selectedDay || !selectedTime) {
      setIsLoading(false);
      return;
    }

    console.log("Calling backend API to generate recurring sessions");
    // No need to set loading state here - we already have local data displayed

    try {
      // Get number of sessions from form data
      const sessions = formData.schedule_sessions || 5;
      const frequency = formData.preferred_cadence || "Weekly";

      // Simplify: try a direct URL that's very likely to work
      const apiEndpoint = "/api/availability/check-session-availability";
      console.log("Using API endpoint:", apiEndpoint);

      // Make API call to backend with 3-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: selectedDay,
            time: selectedTime,
            cadenceType: frequency,
            numberOfSessions: sessions,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error("API error:", response.status);
          // Don't throw - we already have local data displayed
          // Just log the error and continue
          return;
        }

        const data = await response.json();
        console.log("API response:", data);

        // Only update state if API returned valid data
        if (data.availableSessions && Array.isArray(data.availableSessions)) {
          setSelectedSessions(data.availableSessions);

          // Update form data
          handleInputChange({
            target: {
              name: "schedule_selection",
              value: JSON.stringify(data.availableSessions),
              type: "schedule",
            },
          });

          // Update unavailable dates and counts if present
          if (data.unavailableSessions) {
            setUnavailableDates(data.unavailableSessions);
          }

          if (typeof data.unavailableSessionsCount === "number") {
            setUnavailableSessionsCount(data.unavailableSessionsCount);
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error("Fetch error:", fetchError);
        // We already have local data displayed, so no need to update state
      }
    } catch (error) {
      console.error("Error in generateRecurringSessions:", error);
      // We already have local data displayed, so no need to update state
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Always clear time when day changes
    setShowDayOptions(false);
    setShowTimeOptions(true);
  };

  // Handle custom time selection separately from weekly/bi-weekly sessions
  const handleCustomTimeSelect = (time) => {
    console.log(
      "Custom time select: Adding individual session for",
      selectedDay,
      "at",
      time
    );

    // Create a new session for custom cadence
    const newSession = {
      day: selectedDay,
      time: time,
      date: moment().day(selectedDay).format("YYYY-MM-DD"),
      cadenceType: "Custom", // Mark as custom cadence for easy identification
    };

    // Add to existing sessions
    const updatedSessions = [...selectedSessions, newSession];
    setSelectedSessions(updatedSessions);

    console.log("Updated custom sessions:", updatedSessions);

    // Update the form data
    handleInputChange({
      target: {
        name: "schedule_selection",
        value: JSON.stringify(updatedSessions),
        type: "schedule",
      },
    });
  };

  // Generate example sessions for immediate feedback (fallback data)
  const generateLocalSessions = (day, time, frequency) => {
    console.log("Generating local test sessions for immediate feedback");
    const sessions = formData.schedule_sessions || 5;
    const result = [];
    const unavailable = [];

    // Start from today
    let currentDate = moment();

    // Find next occurrence of selected day
    while (currentDate.format("dddd") !== day) {
      currentDate.add(1, "day");
    }

    // Generate sessions
    for (let i = 0; i < sessions; i++) {
      // May 27, 2025 should be marked unavailable
      if (currentDate.format("YYYY-MM-DD") === "2025-05-27") {
        unavailable.push({
          day: currentDate.format("dddd"),
          date: currentDate.format("YYYY-MM-DD"),
          time: time,
          reason: "Unavailable on this date",
        });
      } else {
        result.push({
          day: currentDate.format("dddd"),
          date: currentDate.format("YYYY-MM-DD"),
          time: time,
        });
      }

      // Move to next occurrence
      if (frequency === "Weekly") {
        currentDate.add(7, "days");
      } else if (frequency === "Bi-weekly") {
        currentDate.add(14, "days");
      } else {
        currentDate.add(7, "days");
      }
    }

    return { availableSessions: result, unavailableSessions: unavailable };
  };

  // Track the last selected time to avoid redundant processing
  const [lastProcessedTime, setLastProcessedTime] = useState(null);

  // Direct session creator - bypasses React state for immediate rendering
  const createAndDisplaySessions = (day, timeValue, frequency) => {
    console.log("Creating sessions for", day, timeValue, frequency);

    // Generate sessions immediately
    const sessionCount = formData.schedule_sessions || 5;
    const result = [];
    const unavailable = [];

    // Start from today
    let currentDate = moment();

    // Find next occurrence of selected day
    while (currentDate.format("dddd") !== day) {
      currentDate.add(1, "day");
    }

    // Generate sessions
    for (let i = 0; i < sessionCount; i++) {
      // Create a session object
      const session = {
        day: currentDate.format("dddd"),
        date: currentDate.format("YYYY-MM-DD"),
        time: timeValue,
      };

      result.push(session);

      // Move to next occurrence based on frequency
      if (frequency === "Weekly") {
        currentDate.add(7, "days");
      } else if (frequency === "Bi-weekly") {
        currentDate.add(14, "days");
      } else {
        currentDate.add(7, "days");
      }
    }

    // Update sessions state
    updateSessions(result);

    // Now call the API in the background for the real data
    setTimeout(() => {
      generateRecurringSessions();
    }, 0);

    return { availableSessions: result, unavailableSessions: unavailable };
  };

  // Handle time selection with immediate feedback
  const handleTimeSelect = (time) => {
    console.log("Time selected:", time, "Edit mode:", window.isEditingSession);

    // Clear previous state
    setErrorMessage("");
    setUnavailableSessionsCount(0);
    setUnavailableDates([]);

    // Immediately set UI state
    setSelectedTime(time);
    setShowTimeOptions(false);
    setIsLoading(true);

    // If we're in edit mode, update the existing session
    if (window.isEditingSession && window.editingSessionIndex !== undefined) {
      const editIndex = window.editingSessionIndex;
      const editSession = window.editingSession;

      if (!editSession) {
        console.error("No session being edited");
        setIsLoading(false);
        return;
      }

      console.log("Updating session at index:", editIndex);

      // Update the session with new time
      const updatedSessions = [...sessions];
      updatedSessions[editIndex] = {
        ...editSession,
        time: time,
      };

      updateSessions(updatedSessions);

      // Update form data
      handleInputChange({
        target: {
          name: field_key,
          value: JSON.stringify(updatedSessions),
          type: "schedule",
        },
      });

      // Clear edit mode
      window.isEditingSession = false;
      window.editingSession = null;
      window.editingSessionIndex = null;

      // Close calendar if open
      setIsCalendarOpen(false);
      setIsLoading(false);
      return;
    }

    // Handle different cadence types
    if (currentCadence === "Custom") {
      // Custom cadence logic
      console.log("Using custom cadence handling");
      handleCustomTimeSelect(time);
      return;
    }

    // For weekly/bi-weekly cadence
    if (selectedDay) {
      console.log(`Using ${currentCadence} cadence handling`);

      // Generate sessions immediately - don't wait for API
      const sessionCount = formData.schedule_sessions || 5;
      const frequency = currentCadence || "Weekly";

      // Create temporary local sessions immediately
      const tempSessions = [];
      let currentDate = moment();

      // Find next occurrence of selected day
      while (currentDate.format("dddd") !== selectedDay) {
        currentDate.add(1, "day");
      }

      // Generate sessions
      for (let i = 0; i < sessionCount; i++) {
        tempSessions.push({
          day: currentDate.format("dddd"),
          date: currentDate.format("YYYY-MM-DD"),
          time: time,
        });

        // Move to next occurrence
        if (frequency === "Weekly") {
          currentDate.add(7, "days");
        } else if (frequency === "Bi-weekly") {
          currentDate.add(14, "days");
        } else {
          currentDate.add(7, "days");
        }
      }

      // Update the UI immediately with temporary sessions
      updateSessions(tempSessions);

      // Update form data
      handleInputChange({
        target: {
          name: field_key,
          value: JSON.stringify(tempSessions),
          type: "schedule",
        },
      });

      // Then call the API to get accurate sessions
      setTimeout(() => {
        generateRecurringSessions();
      }, 0);
    }
    setIsLoading(false);
    return;
  };

  // Handle different cadence types
  if (currentCadence === "Custom") {
    // Custom cadence logic
    console.log("Using custom cadence handling");
    handleCustomTimeSelect(time);
    return;
  }

  // For weekly/bi-weekly cadence
  if (selectedDay) {
    console.log(`Using ${currentCadence} cadence handling`);

    // Generate sessions immediately - don't wait for API
    const sessionCount = formData.schedule_sessions || 5;
    const frequency = currentCadence || "Weekly";

    // Create temporary local sessions immediately
    const tempSessions = [];
    let currentDate = moment();

    // Find next occurrence of selected day
    while (currentDate.format("dddd") !== selectedDay) {
      currentDate.add(1, "day");
    }

    // Generate sessions
    for (let i = 0; i < sessionCount; i++) {
      tempSessions.push({
        day: currentDate.format("dddd"),
        date: currentDate.format("YYYY-MM-DD"),
        time: time,
      });

      // Move to next occurrence
      if (frequency === "Weekly") {
        currentDate.add(7, "days");
      } else if (frequency === "Bi-weekly") {
        currentDate.add(14, "days");
      } else {
        currentDate.add(7, "days");
      }
    }

    // Update the UI immediately with temporary sessions
    updateSessions(tempSessions);

    // Update form data
    handleInputChange({
      target: {
        name: field_key,
        value: JSON.stringify(tempSessions),
        type: "schedule",
      },
    });

    // Then call the API to get accurate sessions
    setTimeout(() => {
      generateRecurringSessions();
    }, 0);
  } else {
    setIsLoading(false);
  }

  // Log current state for debugging
  console.log(
    "Render - unavailableSessionsCount:",
    unavailableSessionsCount,
    "totalRequiredSessions:",
    totalRequiredSessions
  );

  // Main component render
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

            {unavailableDates.length > 0 && (
              <div className={styles.unavailable_dates_message}>
                <p>The following dates/times were not available:</p>
                <ul>
                  {unavailableDates.map((session, idx) => (
                    <li key={idx}>
                      {session.day}, {session.date} at {session.time}{" "}
                      <span className={styles.unavailable_reason}>
                        ({session.reason})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedSessions.length > 0 && (
              <div className={styles.sessions_table}>
                {/* Sessions table content will go here */}
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
                    onClick={() => {
                      // Clear all sessions when day changes
                      if (selectedSessions.length > 0) {
                        console.log("Clearing all sessions due to day change");
                        setSelectedSessions([]);
                        handleInputChange({
                          target: {
                            name: "schedule_selection",
                            value: JSON.stringify([]),
                            type: "schedule",
                          },
                        });
                      }

                      // Always clear unavailable dates and count when day changes
                      setUnavailableDates([]);
                      setUnavailableSessionsCount(0);

                      setSelectedDay(day);
                      // Clear time when day changes
                      setSelectedTime(null);
                    }}
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
                        console.log("Time clicked:", time);

                        // Set time first
                        setSelectedTime(time);

                        // Set selected time and generate sessions using the API
                        console.log(
                          "Generating schedule for day:",
                          selectedDay,
                          "and time:",
                          time
                        );

                        // Update selected time state
                        setSelectedTime(time);

                        // Use the API-based generateRecurringSessions function
                        // instead of generating sessions locally
                        generateRecurringSessions();
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.sessions_table}>
              {/* Show loading indicator */}
              {isLoading && (
                <div style={{ textAlign: "center", padding: "15px" }}>
                  <div style={{ fontSize: "16px", color: "#666" }}>
                    Generating sessions...
                  </div>
                </div>
              )}

              {/* Show error message if any */}
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}

              {/* Add info message for rescheduled sessions */}
              {!isLoading && unavailableSessionsCount > 0 && (
                <div
                  style={{
                    backgroundColor: "#e1f0ff",
                    color: "#0056b3",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    border: "1px solid #bee5eb",
                  }}
                >
                  <strong>Note:</strong> {unavailableSessionsCount} session(s)
                  couldn't be scheduled at their original time due to
                  availability constraints. These sessions have been
                  automatically rescheduled to future dates following your
                  selected cadence pattern.
                </div>
              )}
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
                  {(selectedSessions || []).map((session, index) => (
                    <tr key={index}>
                      <td>{moment(session.date).format("MMMM D, YYYY")}</td>
                      <td>{session.day}</td>
                      <td>{session.time}</td>
                      <td>
                        <div className={styles.session_actions}>
                          <button
                            type="button"
                            className={styles.edit_session_button}
                            onClick={() => handleEditSessionCadence(index)}
                          >
                            <FaCalendarAlt />
                          </button>
                          <button
                            type="button"
                            className={styles.remove_session_button}
                            onClick={() => handleRemoveSessionCadence(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!selectedSessions || selectedSessions.length === 0) && (
                    <tr>
                      <td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        No sessions scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Calendar component for weekly/bi-weekly view */}
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
        )}
      </div>
    </div>
  );
};

ScheduleFieldDep.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number.isRequired,
    field_key: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    input_scope: PropTypes.oneOf(["selector", "picker"]),
    availableOrganizations: PropTypes.number,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object,
  formFieldOptions: PropTypes.array,
};
export default ScheduleFieldDep;
