import { useState } from "react";

import classes from "./Contact.module.css";

function ContactPage() {
  const [showContactFormTextValid, setShowContactFormTextValid] =
    useState(false);
  const [showContactFormInputEmailValid, setShowContactFormInputEmailValid] =
    useState(false);
  const [showContactFormInputNameValid, setShowContactFormInputNameValid] =
    useState(false);
  const [showSendStatus, setShowSendStatus] = useState("Send");
  const [showContactName, setShowContactName] = useState("");
  const [showContactEmail, setShowContactEmail] = useState("");
  const [showContactText, setShowContactText] = useState("");

  const onChangeContactNameHandler = (event) => {
    setShowContactName(event.target.value);
    setShowContactFormInputNameValid(false);
  };

  const onChangeContactEmailHandler = (event) => {
    setShowContactEmail(event.target.value);
    setShowContactFormInputEmailValid(false);
  };
  const onChangeContactTextHandler = (event) => {
    setShowContactText(event.target.value);
    setShowContactFormTextValid(false);
  };

  function sendContactForm(event) {
    event.preventDefault();
    if (showContactName.split("").length < 3) {
      setShowContactFormInputNameValid(true);
    }
    if (!showContactEmail.includes("@")) {
      setShowContactFormInputEmailValid(true);
    }
    if (showContactText.split("").length < 10) {
      setShowContactFormTextValid(true);
    }
    setShowSendStatus("Submitting...");
    setShowSendStatus("Submitted");
  }
  return (
    <div className={classes.desktop5}>
      {/* <div className={classes.contactHeaderContainer}>
        <svg
          className={`${classes.desktop3Child} ${classes.sectionHeaderSVG}`}
          width="29"
          height="117"
          viewBox="0 0 29 117"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="29"
            y1="0.5"
            x2="-4.37114e-08"
            y2="0.499997"
            stroke="black"
          />
          <line x1="0.5" x2="0.5" y2="117" stroke="black" />
        </svg>
        // <div className={`${classes.contact} ${classes.sectionHeader}`}>
        //   Contact
        // </div>
      </div> */}
      <div className={`${classes.contact} ${classes.sectionHeaderContact}`}>
        Contact
      </div>
      <form className={classes.contactFormContainer} onSubmit={sendContactForm}>
        <div
          className={`${classes.contactNameContainer} ${classes.contactFieldContainer}`}
        >
          {/* <div
            className={`${classes.contactNameLabel} ${classes.contactLabel}`}
          >
            Name
          </div> */}
          <div className={classes.contactInputContainer}>
            <input
              type="name"
              placeholder="Enter your name"
              onChange={onChangeContactNameHandler}
              value={showContactName}
            ></input>
            <div
              className={`${classes.contactFormError} ${
                showContactFormInputNameValid
                  ? classes.contactFormErrorActive
                  : ""
              }`}
            >
              Name is not valid
            </div>
          </div>
        </div>
        <div
          className={`${classes.contactEmailContainer} ${classes.contactFieldContainer}`}
        >
          {/* <div
            className={`${classes.contactEmailLabel} ${classes.contactLabel}`}
          >
            Email
          </div> */}
          <div className={classes.contactInputContainer}>
            <input
              placeholder="Enter your email"
              onChange={onChangeContactEmailHandler}
              value={showContactEmail}
            ></input>
            <div
              className={`${classes.contactFormError} ${
                showContactFormInputEmailValid
                  ? classes.contactFormErrorActive
                  : ""
              }`}
            >
              Email is not valid
            </div>
          </div>
        </div>
        <div
          className={`${classes.contactMessageCounter} ${classes.contactFieldContainer}`}
        >
          {/* <div
            className={`${classes.contactMessageLabel} ${classes.contactLabel}`}
          >
            Message
          </div> */}
          <div className={classes.contactInputContainer}>
            <textarea
              className={`${classes.contactText}`}
              col="200"
              row="50"
              placeholder="Enter your message here!"
              onChange={onChangeContactTextHandler}
              value={showContactText}
            ></textarea>
            <div
              className={`${classes.contactFormError} ${
                showContactFormTextValid ? classes.contactFormErrorActive : ""
              }`}
            >
              Text is not valid
            </div>
          </div>
        </div>
        <div className={classes.desktop5Inner} />
        <div className={classes.sendButton}>
          <button type="submit" className={classes.send}>
            {showSendStatus}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactPage;
