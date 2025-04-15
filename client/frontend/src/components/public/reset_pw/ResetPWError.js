import React from "react";
import classes from "./ResetPW.module.css";

function ResetPWError() {
  return (
    <div className={classes.errorContainer}>
      <h2 className={classes.errorTitle}>Invalid or Expired Invitation</h2>
      <p className={classes.errorMessage}>
        The invitation link is invalid or has expired.
      </p>
      <p className={classes.errorMessage}>
        Please reach out to <span>Joe_Meehan@OptimaVitaConsulting.com </span>for
        a new invitation link.
      </p>
      <button
        className={classes.button}
        onClick={() =>
          (window.location.href = "https://optimavitaconsulting.com")
        }
      >
        Return Home
      </button>
    </div>
  );
}

export default ResetPWError;
