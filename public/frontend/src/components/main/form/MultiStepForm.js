import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import FormField from "./FormField";
import PriceLedger from "./PriceLedger";
import ConfirmationPage from "./ConfirmationPage";
import PaymentForm from "./PaymentForm";
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
  const [finalTotal, setFinalTotal] = useState(null); // State for final total from PriceLedger
  const formContainerRef = useRef(null);

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

  useEffect(() => {
    // Scroll the form container itself to the top
    if (formContainerRef.current) {
      // Use scrollTop for direct element scrolling
      setTimeout(() => {
        formContainerRef.current.scrollTop = 0;
      }, 0);
    }
  }, [currentStepIndex]); // Scroll to top whenever the step changes

  const getCurrentStepFields = () => {
    const currentStep = currentStepIndex + 1;
    const currentStepData = formSteps.find((s) => s.step === currentStep);
    if (!currentStepData) return [];

    // Get base fields for this step *in the order specified by fieldIds*
    const stepFields = currentStepData.fieldIds
      .map((id) => formFields.find((field) => field.id === id))
      .filter((field) => field !== undefined); // Filter out any undefined results if an ID doesn't match

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
      const selectedOption = formFieldOptions.find(
        (opt) => opt.value === formData.preferred_cadence
      );

      if (selectedOption?.if_selected?.length > 0) {
        const fields = formFieldConditionals.filter((field) =>
          selectedOption.if_selected.includes(field.id)
        );
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

  const handleTotalUpdate = (newTotal) => {
    setFinalTotal(newTotal);
  };

  const handleNext = () => {
    const isValid = validateStep();
    if (isValid) {
      const currentStepData = availableSteps[currentStepIndex]; // Get current step data

      // --- Calculate and set totalAmount if navigating from Confirmation step ---
      if (currentStepData?.title === "Confirmation") {
        let updatedFormData = { ...formData }; // Create a copy to potentially modify

        // Use the total from PriceLedger state
        if (finalTotal !== null) {
          updatedFormData = {
            ...updatedFormData,
            totalAmount: finalTotal, // Use the state value reported by PriceLedger
          };
          console.log("Using Final Total from PriceLedger state:", finalTotal);
        } else {
          console.error("Final total from PriceLedger state is null when proceeding to payment!");
          // Handle error - perhaps prevent moving forward or show a message
          // For now, we'll proceed but log the error.
          // Consider setting a default or fallback if finalTotal is crucial and missing.
          updatedFormData = {
            ...updatedFormData,
            totalAmount: 0, // Fallback or error indicator? Decide based on requirements.
          };
        }

        setFormData(updatedFormData); // Update state with potentially modified data

        // Proceed to the next step (assuming Payment step follows Confirmation)
        if (currentStepIndex + 1 < availableSteps.length) {
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          console.warn("Reached end of steps after Confirmation.");
          // If Payment step is implicitly the next step even if not in availableSteps,
          // you might still increment here, but ensure PaymentForm renders correctly.
          setCurrentStepIndex(currentStepIndex + 1); // Attempt to move to next step index anyway
        }
      } else {
        // --- Default behavior: Move to the next step if available ---
        if (currentStepIndex + 1 < availableSteps.length) {
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          console.log("Reached end of defined steps (not Confirmation).");
          // Handle final submission logic if the form doesn't end with Payment
        }
      }
      // --- End of Calculation/Navigation Logic ---
    } else {
      console.log("Validation failed on current step.");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
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
  const currentStepData = availableSteps[currentStepIndex] || {};
  const isPackageStep = currentStepData?.title === "Package";
  const isConfirmationStep = currentStepData?.title === "Confirmation";
  const isPaymentStep = currentStepData?.title === "Payment";

  return (
    <div ref={formContainerRef} className={`${styles.formContainer} ${isFormOpen ? styles.open : ""}`}>
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
          {/* Render fields for all steps except confirmation and payment */}
          {!isConfirmationStep &&
            !isPaymentStep &&
            currentStepFields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                formData={formData}
                handleInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
            ))}

          {/* --- Special Step Rendering --- */}

          {/* Render Confirmation Page Content FIRST */}
          {isConfirmationStep && (
            <ConfirmationPage
              formData={formData}
              onEditStep={(step) => setCurrentStepIndex(step - 1)}
            />
          )}

          {/* Render Payment Form FIRST */}
          {isPaymentStep && <PaymentForm formData={formData} />}

          {/* Render Price Ledger on Confirmation AND Payment steps, AFTER the main content */}
          {(isPackageStep || isConfirmationStep || isPaymentStep) && formData.lesson_package && (
            <PriceLedger
              formData={formData}
              onTotalCalculated={isConfirmationStep ? handleTotalUpdate : null}
            />
          )}

          {/* --- Action Buttons --- */}
          {/* Render Action buttons AFTER Confirmation/Payment content */}
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
            {!isPaymentStep && ( // Hide "Next" on Payment step, as payment is the final action
              <button
                type="button"
                onClick={handleNext}
                className={styles.btn_primary}
              >
                {isConfirmationStep
                  ? "Continue to Payment"
                  : isLastStep
                  ? "Submit" // Or perhaps hide if confirmation is the last *real* step before payment
                  : "Next"}
              </button>
            )}
          </div>
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
