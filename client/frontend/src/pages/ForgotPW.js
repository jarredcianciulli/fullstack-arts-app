import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./Login.module.css";
import { forgotPassword } from "../components/utils/http";

function ForgotPW() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formData = { email };
      const response = await forgotPassword(formData);
      console.log("Response:", response);
      setSuccess("Password reset link sent to your email!");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.info?.message || "An error occurred while sending the reset link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${classes.loginContainer}`)) {
        setError("");
        setSuccess("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.loginContainer}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formGroup}>
          <label className={classes.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.input}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={classes.errorContainer}>
          {error && <p className={classes.error}>{error}</p>}
          {success && <p className={classes.success}>{success}</p>}
        </div>

        <button
          type="submit"
          className={classes.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        <div className={classes.loginLink}>
          <p>
            Have an account?{" "}
            <Link to="/login" className={classes.loginLinkText}>
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ForgotPW;
