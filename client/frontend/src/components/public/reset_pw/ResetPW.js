import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./ResetPW.module.css";
import { resetPW } from "../../utils/http";

function ResetPW() {
  const { reset_token } = useParams(); // Get reset_token from URL params
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await resetPW(reset_token, password, passwordConfirm);
      setSuccessMessage("Password successfully reset!");

      // Redirect to /login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.info?.message || "Failed to reset password.");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Reset your password</h2>
        <p className={classes.description}>
          Set your new password for your account.
        </p>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.input}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={classes.input}
              required
            />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          {successMessage && (
            <p className={classes.success}>{successMessage}</p>
          )}
          <button type="submit" className={classes.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPW;
