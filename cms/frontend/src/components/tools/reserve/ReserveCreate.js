import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorBlock from "../../utils/UI/ErrorBlock.jsx";
import SuccessBlock from "../../utils/UI/SuccessBlock.jsx";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { createSection } from "../../utils/http.js";

import classes from "./ReserveOverview.module.css";

const ReserveCreate = () => {
  const navigate = useNavigate();

  const [isSuccessVisible, setIsSuccessVisible] = useState(<></>);
  let location = useLocation();
  if (location) {
    // const { title, message } = success;
  }

  //useMutation for Post request
  const { mutateAsync, isError, error, isSuccess, data } = useMutation({
    mutationFn: () => createSection(formData),
    isError: (error, data, context) => {
      console.log(error);
      content = (
        <>
          <ErrorBlock
            title="Failed to load event"
            // status={isError.statusCode}
            message={
              error.message ||
              "Failed to load event. Please check your inputs and try again later."
            }
          />
        </>
      );
    },
    onSettled: () => {},
    onSuccess: (data) => {
      navigate("/reserve", {
        state: {
          title: "Successfully created section",
          message: `${data.title} is now available`,
        },
      });
    },
  });

  useEffect(() => {
    if (location.state) {
      setIsSuccessVisible(
        <SuccessBlock
          title={location.state.title}
          message={location.state.message}
        />
      );
      const timer = setTimeout(() => {
        setIsSuccessVisible(<></>);
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.history.replaceState({}, "");
      };
    }
  }, []);

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["groupClasses"] });

  useEffect(() => {
    console.log(location);
  }, [location]);

  let content;
  const [Modal, setModal] = useState(<></>);

  const [formData, setFormData] = useState({
    // Initialize form data fields
    title: "",
    summary: "",
    description: "",
    active: false,
    archived: false,
  });

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "archived" || e.target.name === "active") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    mutateAsync(formData); // Pass form data to mutation for submission
  };

  return (
    <>
      {isSuccessVisible}
      <div className={classes.actionContainer}>
        <NavLink to="/reserve" className={classes.actionCreate}>
          Back to sections
        </NavLink>
      </div>
      <div className={classes.form}>
        <h2 className={classes.formContentHeader}>Create a section</h2>
        <div className={classes.formContent}>
          <form
            onSubmit={handleSubmit}
            className={classes.formCreateContentContainer}
            encType="multipart/form-data"
          >
            <div className={classes.formFieldContainer}>
              <label className={classes.formLabel}>Title:</label>
              <input
                type="text"
                name="title"
                className={classes.formInput}
                onChange={handleChange}
              />
            </div>

            <div className={classes.formFieldContainer}>
              <label className={classes.formLabel}>Summary:</label>
              <textarea
                type="text"
                name="summary"
                onChange={handleChange}
                className={`${classes.formInput} ${classes.formInputTextArea}`}
              />
            </div>
            <div className={classes.formFieldContainer}>
              <label className={classes.formLabel}>Description:</label>
              <textarea
                name="description"
                onChange={handleChange}
                className={`${classes.formInput} ${classes.formInputTextArea} ${classes.formInputTextAreaDescription}`}
              />
            </div>
            <div className={classes.formFieldContainer}>
              <label className={classes.formLabel}>Active</label>
              <input
                name="active"
                type="checkbox"
                onChange={handleChange}
                className={`${classes.formInput} ${classes.formInputActive} ${classes.formInputCheckbox}`}
              />
            </div>
            <div className={classes.formFieldContainer}>
              <label className={classes.formLabel}>Archived</label>
              <input
                name="archived"
                type="checkbox"
                onChange={handleChange}
                className={`${classes.formInput} ${classes.formInputArchived} ${classes.formInputCheckbox}`}
              />
            </div>
            <div className={classes.formButtonContainer}>
              <button type="submit" className={classes.formButton}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReserveCreate;
