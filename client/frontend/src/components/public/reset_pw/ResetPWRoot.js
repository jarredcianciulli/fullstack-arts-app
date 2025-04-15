import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResetPW from "./ResetPW";
import ResetPWError from "./ResetPWError";
import classes from "./ResetPW.module.css";

function ResetPWRoot() {
  const { reset_token } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    // Assume the presence of reset_token is enough to show the form
    if (reset_token) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [reset_token]);

  if (isValid === null) return <p className={classes.loading}>Loading...</p>;

  return isValid ? <ResetPW resetToken={reset_token} /> : <ResetPWError />;
}

export default ResetPWRoot;
