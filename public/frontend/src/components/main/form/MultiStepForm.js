import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import FormField from "./FormField";
import PriceLedger from "./PriceLedger";

import { formFields } from "../../data/form/formFields";
import { formSteps } from "../../data/form/formSteps";
import { serviceMetadata } from "../../data/form/serviceMetadata";
import { formFieldOptions } from "../../data/form/formFieldOptions";
import { formFieldConditionals } from "../../data/form/formFieldConditionals";
import Close from "../../../assets/x.svg";
import styles from "./Form.module.css";

const MultiStepForm = ({
  service,
  isFormOpen,
  setIsFormOpen,
  className = "",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Get form steps for this service
  const serviceConfig = serviceMetadata.find(
    (config) => config.serviceId === service.id
  );
  const availableSteps = serviceConfig
    ? formSteps.filter((step) => serviceConfig.formSteps.includes(step.step))
    : [];

  // Reset form when closed
  useEffect(() => {
    if (!isFormOpen) {
      setCurrentStepIndex(0);
      setFormData({});
      setValidationErrors({});
    }
  }, [isFormOpen]);

  const getCurrentStepFields = () => {
    const currentStep = currentStepIndex + 1;
    console.log("Current step:", currentStep);
    const currentStepData = formSteps.find((s) => s.step === currentStep);
    console.log("Current step data:", currentStepData);
    if (!currentStepData) return [];

    // Get base fields for this step
    const stepFields = formFields.filter((field) =>
      currentStepData.fieldIds.includes(field.id)
    );
    console.log("Step fields:", stepFields);

    // Get conditional fields if needed
    let conditionalFields = [];

    // Handle student relationship conditionals
    if (formData.student_relationship && currentStep === 1) {
      const selectedOption = formFieldOptions.find(
        (opt) => opt.value === formData.student_relationship
      );

      if (selectedOption?.if_selected?.length > 0) {
        const fields = formFieldConditionals.filter((field) =>
          selectedOption.if_selected.includes(field.id)
        );
        conditionalFields.push(...fields);
      }
    }

    // Handle schedule conditionals
    if (formData.preferred_cadence && currentStep === 4) {
      console.log(
        "Checking schedule conditionals for:",
        formData.preferred_cadence
      );
      const selectedOption = formFieldOptions.find(
        (opt) => opt.value === formData.preferred_cadence
      );
      console.log("Selected option:", selectedOption);

      if (selectedOption?.if_selected?.length > 0) {
        const fields = formFieldConditionals.filter((field) =>
          selectedOption.if_selected.includes(field.id)
        );
        console.log("Conditional fields:", fields);
        conditionalFields.push(...fields);
      }
    }

    return [...stepFields, ...conditionalFields];
  };

  const validateStep = () => {
    const currentFields = getCurrentStepFields();
    const errors = {};
    let isValid = true;

    currentFields.forEach((field) => {
      const value = formData[field.field_key];

      if (field.required && (!value || value.toString().trim() === "")) {
        errors[field.field_key] = "This field is required";
        isValid = false;
        return;
      }

      if (field.type === "input" && field.input_type === "location" && value) {
        if (!value.coordinates || !value.distance) {
          errors[field.field_key] =
            "Please select a valid address from the suggestions";
          isValid = false;
          return;
        }

        if (value.distance > field.location_limit.max_radius_miles) {
          errors[
            field.field_key
          ] = `Location must be within ${field.location_limit.max_radius_miles} miles`;
          isValid = false;
          return;
        }
      }

      if (field.validation && value) {
        if (
          field.validation.min_char &&
          value.length < field.validation.min_char
        ) {
          errors[
            field.field_key
          ] = `Minimum ${field.validation.min_char} characters required`;
          isValid = false;
        }
        if (
          field.validation.max_char &&
          value.length > field.validation.max_char
        ) {
          errors[
            field.field_key
          ] = `Maximum ${field.validation.max_char} characters allowed`;
          isValid = false;
        }
        if (
          field.validation.pattern &&
          !new RegExp(field.validation.pattern).test(value)
        ) {
          errors[field.field_key] = "Invalid format";
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => {
      // Keep existing form data
      const updatedData = {
        ...prevData,
        [name]: newValue,
      };

      // Log form data update
      console.log("Updating form data:", {
        field: name,
        value: newValue,
        formData: updatedData,
      });

      return updatedData;
    });

    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStepIndex < availableSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // Handle form submission
        console.log("Form submitted:", formData);
        setIsFormOpen(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const closeModal = () => {
    if (setIsFormOpen) {
      setIsFormOpen(false);
    }
  };

  if (!isFormOpen || !serviceConfig) return null;

  const currentStepFields = getCurrentStepFields();
  const isLastStep = currentStepIndex === availableSteps.length - 1;
  const currentStepData = availableSteps[currentStepIndex];

  return (
    <div className={`${styles.formContainer} ${isFormOpen ? styles.open : ""}`}>
      <div className={`${styles.multi_step_form} ${className || ""}`}>
        <div className={styles.close_container}>
          <img
            className={styles.close}
            src={Close}
            alt="close button"
            onClick={closeModal}
          />
        </div>

        <h2 className={styles.service_title}>{service.name}</h2>

        <div className={styles.form_progress}>
          {availableSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className={`${styles.progress_step} 
                ${index === currentStepIndex ? styles.active : ""} 
                ${index < currentStepIndex ? styles.completed : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <motion.div
                className={styles.step_number}
                animate={{
                  scale: index === currentStepIndex ? 1.1 : 1,
                  backgroundColor:
                    index === currentStepIndex - 1
                      ? "var(--color-quadiary-200)"
                      : index < currentStepIndex
                      ? "var(--color-quadiary-200)"
                      : index === currentStepIndex
                      ? "var(--color-primary-light-100)"
                      : "var(--color-primary-light-100)",
                  borderColor:
                    index === currentStepIndex - 1
                      ? "var(--color-quadiary-400)"
                      : index < currentStepIndex
                      ? "var(--color-quadiary-400)"
                      : index === currentStepIndex
                      ? "var(--color-primary-500)"
                      : "var(--color-primary-400)",
                  color:
                    index === currentStepIndex - 1
                      ? "var(--color-quadiary-400)"
                      : index <= currentStepIndex
                      ? "var(--color-quadiary-400)"
                      : "var(--color-primary-400)",
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {index + 1}
              </motion.div>
              <motion.div
                className={styles.step_label}
                animate={{
                  color:
                    index === currentStepIndex
                      ? "var(--color-primary-light-1000)"
                      : index < currentStepIndex
                      ? "var(--color-quadiary-700)"
                      : "var(--color-primary-300)",
                  y: index === currentStepIndex ? 2 : 0,
                  opacity: index <= currentStepIndex ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                {step.title}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <h3 className={styles.multi_step_form_title}>
          {currentStepData.title}
        </h3>

        <div className={styles.form_content}>
          {currentStepFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              formData={formData}
              handleInputChange={handleInputChange}
              validationErrors={validationErrors}
            />
          ))}

          <div className={styles.form_actions}>
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className={styles.btn_secondary}
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className={styles.btn_primary}
            >
              {isLastStep ? "Submit" : "Next"}
            </button>
          </div>

          {/* Show price ledger after package selection */}
          {formData.lesson_package && <PriceLedger formData={formData} />}
        </div>
      </div>
    </div>
  );
};

MultiStepForm.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  isFormOpen: PropTypes.bool.isRequired,
  setIsFormOpen: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default MultiStepForm;
