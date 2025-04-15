import React, { useState, useEffect } from "react";
import classes from "../FormStore.module.css";

const Step1 = ({
  formData,
  handleInputChange,
  nextStep,
  validateStep,
  validationErrors,
}) => {
  const [errors, setErrors] = useState(validationErrors || {});

  const handleNext = () => {
    const validationErrors = validateStep(1);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    } else {
      console.log(validationErrors);
      setErrors(validationErrors);
    }
  };
  return (
    <>
      <div>step 1</div>
      <div className={classes.nav}>
        <button onClick={handleNext} className={classes.btn_nav}>
          Continue
        </button>
      </div>
    </>
  );
};
export default Step1;
