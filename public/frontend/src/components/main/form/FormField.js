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
    const option = formFieldOptions.find((opt) => {
      const isInOptions = options?.includes(opt.id);
      const valueMatches = opt.value === value;
      return isInOptions && valueMatches;
    });

    // First, update the selected value
    handleInputChange({
      target: {
        name,
        value: option ? value : "",
        type: "select",
      },
    });

    if (!option) return;

    // Handle sessions update if available
    if (option.sessions) {
      handleInputChange({
        target: {
          name: "schedule_sessions",
          value: option.sessions,
          type: "number",
        },
      });
    }

    // Calculate price based on field type
    if (field_key === "package") {
      // If selecting a package, calculate with current duration
      const basePrice = option.price || 0;
      const sessions = option.sessions || 0;
      const durationPriceIncrease = formData.duration
        ? formFieldOptions.find((opt) => opt.value === formData.duration)
            ?.price_increase_per_session || 0
        : 0;

      const totalPriceIncrease = sessions * durationPriceIncrease;
      const totalPrice = basePrice + totalPriceIncrease;

      console.log("[FormField] Package selection - Calculating price:", {
        basePrice,
        sessions,
        durationPriceIncrease,
        totalPriceIncrease,
        totalPrice,
        currentDuration: formData.duration,
      });
      console.log(totalPriceIncrease, "totalPriceIncrease");

      handleInputChange({
        target: {
          name: "totalAmount",
          value: totalPrice,
          type: "number",
        },
      });
    } else if (field_key === "duration") {
      // If selecting duration, recalculate with current package
      const packageOption = formFieldOptions.find(
        (opt) => opt.value === formData.package
      );

      if (packageOption) {
        const basePrice = packageOption.price || 0;
        const sessions = packageOption.sessions || 0;
        const durationPriceIncrease = option.price_increase_per_session || 0;

        const totalPriceIncrease = sessions * durationPriceIncrease;
        const totalPrice = basePrice + totalPriceIncrease;

        console.log("[FormField] Duration selection - Calculating price:", {
          basePrice,
          sessions,
          durationPriceIncrease,
          totalPriceIncrease,
          totalPrice,
          currentPackage: formData.package,
        });

        handleInputChange({
          target: {
            name: "totalAmount",
            value: totalPrice,
            type: "number",
          },
        });
      }
    }
  };
  // Auto-select the only option if there's exactly one
  React.useEffect(() => {
    if (type === "select" && options?.length === 1) {
      const singleOption = formFieldOptions.find(
        (opt) => opt.id === options[0]
      );
      if (singleOption && formData[field_key] !== singleOption.value) {
        handleInputChange({
          target: {
            name: field_key,
            value: singleOption.value,
            type: "select",
          },
        });
      }
    }
  }, [type, options, field_key, formData, handleInputChange]);

  // Don't render if not visible or if it's a single-option select field that's already selected
  if (
    !isVisible() ||
    (type === "select" && options?.length === 1 && formData[field_key])
  ) {
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
          formData={formData}
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
