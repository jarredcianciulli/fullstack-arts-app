import React from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { formFieldOptions } from "../../data/form/formFieldOptions";
import { formFieldConditionals } from "../../data/form/formFieldConditionals";
import { formFields } from "../../data/form/formFields";
import LocationField from "./LocationField";
import ScheduleField from "./ScheduleField";
import CardField from "./CardField";
import clsx from "clsx";

const FormField = ({
  field,
  formData,
  handleInputChange,
  onBlur,
  validationErrors,
  className = "",
}) => {
  const {
    id,
    type,
    input_type,
    label,
    placeholder,
    required,
    options,
    validation,
    visibility,
    field_key,
  } = field;

  // Check field visibility based on conditionals
  const isVisible = () => {
    if (visibility === "always") return true;
    if (visibility === "hidden") return false;

    // First check if this field is in formFieldConditionals
    const isConditionalField = formFieldConditionals.some(
      (field) => field.id === id
    );

    if (isConditionalField) {
      // Find the conditional field definition
      const conditionalField = formFieldConditionals.find(
        (field) => field.id === id
      );
      if (!conditionalField) return false;

      // Get the value from the source field
      const sourceValue = formData[conditionalField.source_field_key];
      if (!sourceValue) return false;

      // Check if the value matches any of the show_when_values
      return conditionalField.show_when_values.includes(sourceValue);
    }

    // If not a conditional field, show it if it's in the current step
    return true;
  };

  // Validate field value
  const validateField = (value) => {
    if (!validation) return true;

    if (validation.min_char && value.length < validation.min_char) {
      return false;
    }
    if (validation.max_char && value.length > validation.max_char) {
      return false;
    }
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return false;
    }
    return true;
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    // Find the selected option to get its label
    const option = formFieldOptions.find((opt) => {
      const isInOptions = options?.includes(opt.id);
      const valueMatches = opt.value === value;
      return isInOptions && valueMatches;
    });

    // Update the selected value
    handleInputChange({
      target: {
        name,
        value: option ? value : "",
        type: "select",
      },
    });

    // If the option has sessions, update schedule_sessions
    if (option?.sessions) {
      handleInputChange({
        target: {
          name: "schedule_sessions",
          value: option.sessions,
          type: "number",
        },
      });
    }
  };

  if (!isVisible()) {
    return null;
  }

  const fieldClassName = `${styles.form_field} ${className} ${
    validationErrors[field_key] ? styles.has_error : ""
  }`;

  return (
    <div className={fieldClassName}>
      {type !== "schedule" && (
        <label htmlFor={id} className={styles.form_label}>
          {label}
          {required && <span className={styles.required_mark}>*</span>}
        </label>
      )}

      {type === "input" &&
        (input_type === "location" ? (
          <LocationField
            field={field}
            formData={formData}
            handleInputChange={handleInputChange}
            onBlur={onBlur}
            validationErrors={validationErrors}
          />
        ) : (
          <input
            id={id}
            type={input_type}
            name={field_key}
            placeholder={placeholder}
            value={formData[field_key] || ""}
            onChange={handleInputChange}
            onBlur={onBlur}
            required={required}
            className={styles.form_input}
          />
        ))}

      {type === "schedule" && (
        <ScheduleField
          field={field}
          formData={formData}
          handleInputChange={handleInputChange}
          onBlur={onBlur}
          validationErrors={validationErrors}
        />
      )}

      {type === "select" && input_type === "card" ? (
        <CardField
          options={options.map((optionId) =>
            formFieldOptions.find((opt) => opt.id === optionId)
          )}
          value={formData[field_key] || ""}
          onChange={handleSelectChange}
          field_key={field_key}
          required={required}
        />
      ) : type === "select" ? (
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
                  handleSelectChange({
                    target: {
                      name: field_key,
                      value: option.value,
                      schedule_sessions: option.sessions,
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
      ) : null}

      {type === "textarea" && (
        <textarea
          id={id}
          name={field_key}
          placeholder={placeholder}
          value={formData[field_key] || ""}
          onChange={handleInputChange}
          onBlur={onBlur}
          required={required}
          className={styles.form_textarea}
        />
      )}

      {type === "checkbox" && (
        <div className={styles.checkbox_wrapper}>
          <input
            id={id}
            type="checkbox"
            name={field_key}
            checked={formData[field_key] || false}
            onChange={handleInputChange}
            onBlur={onBlur}
            required={required}
            className={styles.form_checkbox}
          />
          <span className={styles.checkbox_label}>{label}</span>
        </div>
      )}

      {validationErrors[field_key] && (
        <span className={styles.error_message}>
          {validationErrors[field_key]}
        </span>
      )}
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    input_type: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.number),
    validation: PropTypes.shape({
      min_char: PropTypes.number,
      max_char: PropTypes.number,
      pattern: PropTypes.string,
    }),
    visibility: PropTypes.oneOf(["always", "conditional", "hidden"]),
    field_key: PropTypes.string.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  validationErrors: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default FormField;
