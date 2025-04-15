import React, { useState, useEffect } from "react";

import classes from "../FormStore.module.css";

const Step2 = ({
  formData,
  handleInputChange,
  nextStep,
  validateStep,
  prevStep,
  validationErrors,
}) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    // Validate the current step
    const validationErrors = validateStep(2);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <>
      <div>step 2</div>
      <div className={classes.nav}>
        <button onClick={prevStep} className={classes.btn_nav}>
          Previous
        </button>
        <button onClick={handleNext} className={classes.btn_nav}>
          Next
        </button>
      </div>
    </>
  );
};
export default Step2;
