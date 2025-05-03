import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { formFieldOptions } from "../../data/form/formFieldOptions";
import { formFieldConditionals } from "../../data/form/formFieldConditionals";
import clsx from "clsx";

const ScheduleField = ({ field, formData, handleInputChange, validationErrors }) => {
  const { input_scope, field_key, required, options } = field;
  const [selectedDays, setSelectedDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (input_scope === "picker" && formData.preferred_cadence) {
      // Fetch available times based on selected cadence
      fetchAvailableTimes(formData.preferred_cadence);
    }
  }, [input_scope, formData.preferred_cadence]);

  const fetchAvailableTimes = async (cadence) => {
    try {
      // This would be replaced with an actual API call
      const mockTimes = [
        { day: "Monday", times: ["9:00 AM", "10:00 AM", "2:00 PM"] },
        { day: "Wednesday", times: ["11:00 AM", "1:00 PM", "3:00 PM"] },
        { day: "Friday", times: ["9:00 AM", "2:00 PM", "4:00 PM"] },
      ];
      setAvailableTimes(mockTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const handleDaySelect = (day, time) => {
    const newSelection = { day, time };
    let updatedSelection;

    if (formData.preferred_cadence === "Weekly") {
      // For weekly, only allow one selection
      updatedSelection = [newSelection];
    } else if (formData.preferred_cadence === "Bi-weekly") {
      // For bi-weekly, allow two selections
      const existingIndex = selectedDays.findIndex(
        (sel) => sel.day === day && sel.time === time
      );

      if (existingIndex === -1) {
        // Add new selection if not already selected
        updatedSelection =
          selectedDays.length < 2
            ? [...selectedDays, newSelection]
            : [selectedDays[1], newSelection];
      } else {
        // Remove the selection if already selected
        updatedSelection = selectedDays.filter(
          (_, index) => index !== existingIndex
        );
      }
    }

    setSelectedDays(updatedSelection);
    handleInputChange({
      target: {
        name: field_key,
        value: updatedSelection,
        type: "schedule",
      },
    });
  };

  if (input_scope === "selector") {
    // Render cadence selector (Weekly/Bi-weekly)
    return (
      <div className={styles.schedule_options_grid}>
        {options.map((optionId) => {
          const option = formFieldOptions.find((opt) => opt.id === optionId);
          return (
            <div
              key={option.id}
              className={clsx(styles.schedule_option_card, {
                [styles.selected]: formData[field_key] === option.value,
              })}
              onClick={() =>
                handleInputChange({
                  target: {
                    name: field_key,
                    value: option.value,
                    type: "select",
                  },
                })
              }
            >
              <div className={styles.schedule_option_content}>
                <span className={styles.schedule_option_text}>
                  {option.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Render schedule picker
  return (
    <div className={styles.schedule_picker_container}>
      {!formData.preferred_cadence ? (
        <div className={styles.schedule_picker_message}>
          Please select a preferred cadence first
        </div>
      ) : (
        <>
          <div className={styles.schedule_picker_header}>
            <h3>Select your preferred {formData.preferred_cadence.toLowerCase()} time slot{formData.preferred_cadence === "Bi-weekly" ? "s" : ""}</h3>
            {formData.preferred_cadence === "Bi-weekly" && (
              <p className={styles.schedule_picker_subtitle}>
                Please select two time slots
              </p>
            )}
          </div>
          <div className={styles.available_times_grid}>
            {availableTimes.map(({ day, times }) => (
              <div key={day} className={styles.day_column}>
                <div className={styles.day_header}>{day}</div>
                <div className={styles.time_slots}>
                  {times.map((time) => {
                    const isSelected = selectedDays.some(
                      (sel) => sel.day === day && sel.time === time
                    );
                    return (
                      <div
                        key={time}
                        className={clsx(styles.time_slot, {
                          [styles.selected]: isSelected,
                        })}
                        onClick={() => handleDaySelect(day, time)}
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {validationErrors[field_key] && (
        <span className={styles.error_message}>
          {validationErrors[field_key]}
        </span>
      )}
    </div>
  );
};

ScheduleField.propTypes = {
  field: PropTypes.shape({
    input_scope: PropTypes.oneOf(["selector", "picker"]).isRequired,
    field_key: PropTypes.string.isRequired,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
};

export default ScheduleField;
