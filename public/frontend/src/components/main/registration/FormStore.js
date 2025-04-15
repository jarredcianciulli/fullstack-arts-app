import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ErrorBlock from "../../utils/UI/ErrorBlock.jsx";
import SuccessBlock from "../../utils/UI/SuccessBlock.jsx";
import classes from "./FormStore.module.css";
import Close from "../../../assets/x.svg";
import Step1 from "./steps/Step1.js";
import Step2 from "./steps/Step2.js";
import Step3 from "./steps/Step3.js";
import Confirmation from "./steps/Confirmation.js";
import { createNewMusicPrivateLessonRequest } from "../../utils/http.js";

const FormStore = ({ isFormOpen, setIsFormOpen, ...props }) => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedService: "",
    yearsStudied: "",
    instrument: "",
    relationToStudent: "",
    yearsPlayed: "",
    studentName: "",
    studentsAge: "",
    userRelation: "",
    sponsorName: "",
    telephone: "",
    email: "",
    location: "",
    dates: [],
    times: [],
    timezone: "",
    duration: "",
    frequency: "",
    certify18: "",
    payment: {},
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const { mutateAsync, isError, error } = useMutation({
    mutationFn: () => createNewMusicPrivateLessonRequest(formData),
    onError: (error) => {},
    onSuccess: (data) => {
      setIsSuccessModal(true);

      setFormData({
        selectedService: "",
        yearsStudied: "",
        instrument: "",
        relationToStudent: "",
        yearsPlayed: "",
        studentName: "",
        studentsAge: "",
        userRelation: "",
        sponsorName: "",
        telephone: "",
        email: "",
        location: "",
        dates: [],
        times: [],
        timezone: "",
        duration: "",
        frequency: "",
        certify18: "",
        payment: {},
      });
      setCurrentStep(1);
      navigate("/", {
        state: {
          title: "Successfull!",
          message: `Thank you!`,
        },
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let updatedArray = [...formData[name]];
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter((item) => item !== value);
      }
      setFormData({ ...formData, [name]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDaySelection = (day, isSelected) => {
    setFormData((prevData) => {
      const preferredDays = isSelected
        ? [...prevData.preferredDays, day]
        : prevData.preferredDays.filter((d) => d !== day);

      return { ...prevData, preferredDays };
    });
  };

  const handleTimeChange = (day, times) => {
    setFormData((prevData) => ({
      ...prevData,
      preferredTimes: { ...prevData.preferredTimes, [day]: times },
    }));
  };

  const handleLocationSelection = (location, isSelected) => {
    setFormData((prevData) => {
      const preferredLocations = isSelected
        ? [...prevData.preferredLocations, location]
        : prevData.preferredLocations.filter((loc) => loc !== location);

      return { ...prevData, preferredLocations };
    });
  };

  const validateStep1 = () => {
    const errors = {};
    // if (!formData.instrument) errors.instrument = "Instrument is required";
    // if (!formData.yearsPlayed) errors.yearsPlayed = "Years played is required";
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    // if (!formData.studentName) errors.studentName = "Student name is required";
    // if (!formData.userRelation)
    //   errors.userRelation = "You must select who you are";
    // if (!formData.telephone) errors.telephone = "Telephone is required";
    // if (!formData.email) errors.email = "Email is required";
    // if (
    //   (formData.userRelation === "Parent" ||
    //     formData.userRelation === "Grandparent" ||
    //     formData.userRelation === "Other") &&
    //   !formData.studentsAge
    // )
    //   errors.studentsAge = "Student age is required";
    // if (
    //   (formData.userRelation === "Parent" ||
    //     formData.userRelation === "Grandparent" ||
    //     formData.userRelation === "Other") &&
    //   !formData.sponsorName
    // )
    //   errors.sponsorName = "Your name is required";

    // if (formData.userRelation === "Other" && !formData.relationToStudent)
    //   errors.relationToStudent = "Relation to student is required";

    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    return errors;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return {};
    }
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length === 0) {
      setValidationErrors({});
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setValidationErrors(errors);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    mutateAsync(formData);
    setIsFormOpen(false);
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={handleNext}
            validateStep={validateStep}
            validationErrors={validationErrors}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            handleInputChange={handleInputChange}
            prevStep={handlePrev}
            nextStep={handleNext}
            validateStep={validateStep}
            validationErrors={validationErrors}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            handleDaySelection={handleDaySelection}
            handleTimeChange={handleTimeChange}
            handleLocationSelection={handleLocationSelection}
            nextStep={handleNext}
            prevStep={handlePrev}
            validateStep={validateStep}
            validationErrors={validationErrors}
          />
        );
      case 4:
        return (
          <Confirmation
            formData={formData}
            prevStep={handlePrev}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const [successModal, setSuccessModal] = useState(<></>);

  useEffect(() => {
    let elem;
    if (isSuccessModal) {
      elem = (
        <SuccessBlock
          title="Success!"
          message="Your request has been submitted successfully!"
        />
      );
      setTimeout(() => {
        setIsSuccessModal(false);
      }, 3000);
    } else {
      elem = <></>;
    }
    setSuccessModal(elem);
  }, [isSuccessModal]);
  useEffect(() => {
    if (props.serviceData.service_type === "Private lessons") {
      setFormTitle("Private lessons registration");
    }
    if (props.serviceData.service_type === "Piano tuning") {
      setFormTitle("Book a piano tuning");
    }
    if (props.serviceData.service_type === "Group music class") {
      setFormTitle("Group class registration");
    }
  }, [props]);

  const closeModal = () => {
    setIsFormOpen(false);
  };
  console.log(props.sectionData, props.serviceData);

  return (
    <>
      {isFormOpen && (
        <div className={classes.formContainer}>
          <div className={classes.multi_step_form}>
            <div className={classes.close_container}>
              <img
                className={classes.close}
                src={Close}
                alt="close button"
                onClick={closeModal}
              />
            </div>

            <h2 className={classes.multi_step_form_title}>{formTitle}</h2>
            {isError && <ErrorBlock error={error.message} />}
            {renderForm()}
          </div>
        </div>
      )}
      {successModal}
    </>
  );
};

export default FormStore;
