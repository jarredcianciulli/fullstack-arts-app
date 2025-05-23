import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import FormField from "./FormField";
import PriceLedger from "./PriceLedger";
import ConfirmationPage from "./ConfirmationPage";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [finalTotal, setFinalTotal] = useState(null); // State for final total from PriceLedger
  const formContainerRef = useRef(null);

  // Get form steps for this service
  const serviceConfig = serviceMetadata.find(
    (config) => config.serviceId === service.id
  );
  console.log(serviceConfig);
  const availableSteps = serviceConfig.formSteps
    .map((stepId) => formSteps.find((step) => step.id === stepId))
    .filter(Boolean); // Filter out any undefined steps if there's an invalid ID

  console.log(availableSteps);

  // Parse query string parameters and convert to appropriate types
  const parseQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    
    // Loop through all parameters and process them
    for (const [key, value] of searchParams.entries()) {
      try {
        // Special handling for schedule_selection to properly parse dates
        if (key === 'schedule_selection') {
          // First try to parse as JSON
          if (value.startsWith('[') || value.startsWith('{')) {
            const parsed = JSON.parse(value);
            // Process each item to ensure dates are properly parsed
            if (Array.isArray(parsed)) {
              params[key] = parsed.map(item => {
                if (item.date && typeof item.date === 'string') {
                  // Keep date as string as it will be properly handled by the ScheduleField component
                  return item;
                }
                return item;
              });
            } else {
              params[key] = parsed;
            }
          } else {
            params[key] = value;
          }
        }
        // Check if value is JSON (for objects like location, package, etc)
        else if (value.startsWith('{') || value.startsWith('[')) {
          params[key] = JSON.parse(value);
        } else if (value === 'true') {
          params[key] = true;
        } else if (value === 'false') {
          params[key] = false;
        } else if (!isNaN(value) && value.trim() !== '') {
          params[key] = Number(value);
        } else {
          params[key] = value;
        }
      } catch (error) {
        // If JSON parsing fails, use the raw value
        console.warn(`Failed to parse query param ${key}:`, error);
        params[key] = value;
      }
    }
    
    // Debug the parsed parameters
    console.log('[URL Params] Parsed parameters:', params);
    
    return params;
  };

  // Generate query string from form data
  const generateQueryString = (data, stepIndex = currentStepIndex) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // For objects and arrays, convert to JSON string
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    // Add step parameter
    if (stepIndex > 0) {
      searchParams.append('step', stepIndex);
    }
    
    return searchParams.toString();
  };

  // Update URL with current form data
  const updateUrlWithFormData = (data = formData, stepIndex = currentStepIndex) => {
    const queryString = generateQueryString(data, stepIndex);
    
    // Update URL without causing a navigation/page reload
    const newUrl = `${location.pathname}${queryString ? `?${queryString}` : ''}`;
    navigate(newUrl, { replace: true });
  };

  // Load form data from URL on mount
  useEffect(() => {
    if (isFormOpen && location.search) {
      const params = parseQueryParams();
      console.log('Initializing form from query params:', params);
      
      // Set form data from params
      if (Object.keys(params).length > 0) {
        setFormData(prevData => ({
          ...prevData,
          ...params
        }));
        
        // Navigate to specific step if specified
        if (params.step !== undefined && !isNaN(params.step)) {
          const stepIndex = parseInt(params.step, 10);
          if (stepIndex >= 0 && stepIndex < availableSteps.length) {
            setCurrentStepIndex(stepIndex);
          }
        }
      }
    }
  }, [isFormOpen, location.search]);

  // Reset form when closed
  useEffect(() => {
    if (!isFormOpen) {
      setCurrentStepIndex(0);
      setFormData({});
      setValidationErrors({});
      
      // Clear the URL parameters when form is closed
      if (location.search) {
        navigate(location.pathname, { replace: true });
      }
    }
  }, [isFormOpen, navigate, location]);

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
    const serviceConfig = serviceMetadata.find(
      (config) => config.serviceId === service.id
    );

    if (!serviceConfig) return [];
    console.log(serviceConfig);
    // Filter form steps to those available for this service
    // const availableSteps = formSteps.filter((step) =>
    //   serviceConfig.formSteps.includes(step.step)
    // );
    const availableSteps = serviceConfig.formSteps
      .map((stepId) => formSteps.find((step) => step.id === stepId))
      .filter(Boolean); // Filter out any undefined steps if there's an invalid ID

    const currentStep = currentStepIndex;
    console.log(availableSteps);

    const currentStepData = availableSteps.find(
      (s, i) => i === currentStepIndex
    );
    console.log(currentStepData);
    if (!currentStepData) return [];
    console.log(currentStepData.fieldIds);
    // Get base fields for this step *in the order specified by fieldIds*
    const stepFields = currentStepData.fieldIds
      .map((id) => formFields.find((field) => field.id === id))
      .filter((field) => field !== undefined); // Filter out any undefined results if an ID doesn't match
    console.log(stepFields);
    // Get conditional fields if needed
    let conditionalFields = [];

    // Handle student relationship conditionals
    if (formData.student_relationship && currentStep === 0) {
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
    console.log(formData.preferred_cadence);
    const scheduleStep = availableSteps.findIndex(
      (step) => step.title === "Schedule"
    );
    console.log(scheduleStep);
    // Handle schedule conditionals
    if (formData.preferred_cadence && currentStep === scheduleStep) {
      const selectedOption = formFieldOptions.find(
        (opt) => opt.value === formData.preferred_cadence
      );
      console.log(selectedOption);

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

    console.log('[Validation] Validating fields:', currentFields);
    console.log('[Validation] Current form data:', formData);

    currentFields.forEach((field) => {
      const value = formData[field.field_key];
      console.log(`[Validation] Checking field: ${field.field_key}, value:`, value);

      if (field.required && (!value || (typeof value === 'string' && value.trim() === ""))) {
        console.log(`[Validation] Required field ${field.field_key} is empty`);
        errors[field.field_key] = "This field is required";
        isValid = false;
        return;
      }

      if (field.type === "input" && field.input_type === "location") {
        console.log(`[Validation] Validating location field ${field.field_key}:`, value);
        
        // If the field is required but empty, we've already handled it above
        // Only validate if there's a value
        if (value) {
          if (!value.coordinates || !value.distance) {
            console.log(`[Validation] Location field ${field.field_key} missing coordinates or distance`);
            errors[field.field_key] =
              "Please select a valid address from the suggestions";
            isValid = false;
            return;
          }

          if (field.location_limit && field.location_limit.max_radius_miles && 
              value.distance > field.location_limit.max_radius_miles) {
            console.log(`[Validation] Location field ${field.field_key} distance exceeds limit`);
            errors[
              field.field_key
            ] = `Location must be within ${field.location_limit.max_radius_miles} miles`;
            isValid = false;
            return;
          } else {
            console.log(`[Validation] Location field ${field.field_key} passed validation`);
          }
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

  // Handle blur event to update URL when user finishes typing in a field
  const handleInputBlur = () => {
    // Update URL with current form data when focus leaves an input
    updateUrlWithFormData();
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
      
      // Don't update URL on every keystroke - now handled by onBlurHandler

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
    console.log('[Navigation] Available steps:', availableSteps);
    console.log('[Navigation] Current step index:', currentStepIndex);
    console.log('[Navigation] Validating current step...');
    const isValid = validateStep();
    console.log('[Navigation] Validation result:', isValid);
    
    if (isValid) {
      console.log('[Navigation] Validation passed, proceeding to next step');
      // Update URL with current step before navigation
      updateUrlWithFormData();
      const currentStepData = availableSteps[currentStepIndex]; // Get current step data

      // --- Calculate and set totalAmount if navigating from Confirmation step ---
      if (false && currentStepData?.title === "Confirmation") { // This block is now effectively disabled and will be removed by targeting the outer if/else structure
        let updatedFormData = { ...formData }; // Create a copy to potentially modify

        // Use the total from PriceLedger state
        if (finalTotal !== null) {
          updatedFormData = {
            ...updatedFormData,
            totalAmount: finalTotal, // Use the state value reported by PriceLedger
          };
          console.log("Using Final Total from PriceLedger state:", finalTotal);
        } else {
          console.error(
            "Final total from PriceLedger state is null when proceeding to payment!"
          );
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
          console.log(`[Navigation] Moving to next step: ${currentStepIndex + 1}`);
          const nextStepIndex = currentStepIndex + 1;
          const nextStep = availableSteps[nextStepIndex];
          console.log('[Navigation] Next step will be:', nextStep?.title || 'Unknown');
          
          // First update the URL with the new step index
          updateUrlWithFormData(formData, nextStepIndex);
          
          // Then set the current step index (this will also trigger a re-render)
          setCurrentStepIndex(nextStepIndex);
        } else {
          console.log("[Navigation] Reached end of defined steps (not Confirmation).");
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
      const newIndex = currentStepIndex - 1;
      console.log(`[Navigation] Moving back to step: ${newIndex}`);
      
      // First update URL with the new step index
      updateUrlWithFormData(formData, newIndex);
      
      // Then set the current step index
      setCurrentStepIndex(newIndex);
    }
  };

  const closeModal = () => {
    if (setIsFormOpen) {
      // Clear URL parameters when closing the form
      if (location.search) {
        navigate(location.pathname, { replace: true });
      }
      setIsFormOpen(false);
    }
  };

  if (!isFormOpen || !serviceConfig) return null;

  const currentStepFields = getCurrentStepFields();
  console.log(availableSteps);
  const isLastStep = currentStepIndex === availableSteps.length - 1;
  const currentStepData = availableSteps[currentStepIndex] || {};
  const isPackageStep = currentStepData?.title === "Package";
  const isConfirmationStep = currentStepData?.title === "Confirmation";
  const isPaymentStep = currentStepData?.title === "Payment";

  return (
    <div
      ref={formContainerRef}
      className={`${styles.formContainer} ${isFormOpen ? styles.open : ""}`}
    >
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
                  // backgroundColor:
                  //   index === currentStepIndex - 1
                  //     ? "var(--color-quadiary-200)"
                  //     : index < currentStepIndex
                  //     ? "var(--color-quadiary-200)"
                  //     : index === currentStepIndex
                  //     ? "var(--color-primary-light-100)"
                  //     : "var(--color-primary-light-100)",
                  borderColor:
                    index === currentStepIndex - 1
                      ? "var(--color-quadiary-400)"
                      : index < currentStepIndex
                      ? "var(--color-quadiary-400)"
                      : index === currentStepIndex
                      ? "var(--color-primary-500)"
                      : "var(--color-primary-400)",
                  color:
                    index === currentStepIndex
                      ? "var(--color-primary-600)"
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
                onBlur={handleInputBlur}
                validationErrors={validationErrors}
              />
            ))}

          {/* Render Confirmation Page Content */}
          {isConfirmationStep && (
            <ConfirmationPage
              formData={{ ...formData, totalAmount: finalTotal !== null ? finalTotal : formData.totalAmount || 0 }}
              onEditStep={(stepIndex) => setCurrentStepIndex(stepIndex - 1) }
              service={service}
            />
          )}

          {/* Render Price Ledger on Package and Confirmation steps */}
          {(isPackageStep || isConfirmationStep) && formData.package && (
            <PriceLedger
              formData={formData}
              onTotalCalculated={isConfirmationStep ? handleTotalUpdate : null}
            />
          )}

          {/* --- Action Buttons --- */}
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
            {/* Hide "Next" button on Confirmation step (and non-existent Payment step) */}
            {!isConfirmationStep && !isPaymentStep && currentStepIndex < availableSteps.length -1 && (
              <button
                type="button"
                onClick={handleNext}
                className={styles.btn_primary}
              >
                {isLastStep
                  ? "Submit" 
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
