import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";

function NewPW() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation logic
  const validatePassword = (password) => {
    const minLength = 8;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return password.length >= minLength && regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate a successful password reset
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Password updated successfully!");
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".login-container")) {
        setError(""); // Clear error if click is outside the form
      }
    };

    const errorTimeout = setTimeout(() => {
      setError("");
    }, 10000);

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(errorTimeout);
    };
  }, []);

  return (
    <div className={classes.loginContainer}>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGroup}>
          <label className={classes.label} htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={classes.input}
            placeholder="Enter new password"
          />
        </div>

        <div className={classes.formGroup}>
          <label className={classes.label} htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={classes.input}
            placeholder="Confirm new password"
          />
        </div>

        <div className={classes.errorContainer}>
          {error && <p className={classes.error}>{error}</p>}
        </div>

        <button
          type="submit"
          className={classes.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default NewPW;
