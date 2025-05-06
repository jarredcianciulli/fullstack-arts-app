import React from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { FaEdit } from "react-icons/fa";
import { formFields } from "../../data/form/formFields";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const ConfirmationPage = ({ formData, onEditStep }) => {
  // Group fields by section
  const fieldsBySection = formFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {});

  const formatFieldValue = (field, value) => {
    if (!value) return "Not provided";

    switch (field.input_type || field.type) {
      case "card":
        const option = formFieldOptions.find(
          (opt) => opt.id === parseInt(value)
        );
        return option ? `${option.title} - $${option.price}` : String(value);
      case "location":
        if (typeof value === "object" && value.address) {
          const fee =
            value.distance <= 5
              ? 15
              : value.distance <= 10
              ? 22
              : value.distance <= 20
              ? 30
              : 0;
          return `${value.address} ($${fee} travel fee per session)`;
        }
        return String(value);
      case "schedule":
        if (field.input_scope === "selector") {
          return String(value);
        }
        if (Array.isArray(value)) {
          return value
            .map((session) => `${session.day} at ${session.time}`)
            .join(", ");
        }
        try {
          const sessions = JSON.parse(value);
          return sessions
            .map((session) => `${session.day} at ${session.time}`)
            .join(", ");
        } catch {
          return String(value);
        }
      default:
        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    }
  };

  const getSectionStep = (section) => {
    switch (section) {
      case "package":
        return 1;
      case "student":
        return 2;
      case "location":
        return 3;
      case "schedule":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className={styles.confirmation_container}>
      {Object.entries(fieldsBySection).map(([section, fields]) => (
        <div key={section} className={styles.confirmation_section}>
          <div className={styles.section_header}>
            <h3>
              {section.charAt(0).toUpperCase() + section.slice(1)} Details
            </h3>
            <button
              className={styles.edit_button}
              onClick={() => onEditStep(getSectionStep(section))}
            >
              <FaEdit /> Edit
            </button>
          </div>
          <div className={styles.section_content}>
            {fields.map((field) => {
              // Skip fields that should be hidden based on conditions
              if (
                field.visibility === "conditional" &&
                !formData[field.field_key]
              ) {
                return null;
              }

              return (
                <div key={field.id} className={styles.field_row}>
                  <span className={styles.field_label}>
                    {field.label || field.field_key}:
                  </span>
                  <span className={styles.field_value}>
                    {formatFieldValue(field, formData[field.field_key])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

ConfirmationPage.propTypes = {
  formData: PropTypes.object.isRequired,
  onEditStep: PropTypes.func.isRequired,
};

export default ConfirmationPage;
