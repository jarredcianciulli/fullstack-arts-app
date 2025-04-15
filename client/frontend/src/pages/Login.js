import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { loginUser } from "../components/utils/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation logic
  const validatePassword = (password) => {
    const minLength = 8;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return password.length >= minLength && regex.test(password);
  };

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        navigation("/profile");
      } else if (data.status === 401 || data.status === 400) {
        setError("User is not authorized on this app.");
      }
    },
    onError: (error) => {
      setError(
        error.message ||
          "Failed to authenticate. Please check your inputs and try again."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
      return;
    }

    const formData = {
      email,
      password,
    };

    setError("");
    setIsSubmitting(true);
    mutate(formData);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${classes.loginContainer}`)) {
        setError(""); // Clear error if click is outside the form
      }
    };

    // Set a timeout to clear the error after 10 seconds
    const errorTimeout = setTimeout(() => {
      setError("");
    }, 10000); // 10 seconds

    // Add event listener for clicks outside the form
    document.addEventListener("click", handleClickOutside);

    // Cleanup: Remove event listener and clear timeout when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(errorTimeout);
    };
  }, []); // Empty dependency array to run this effect once when the component mounts

  return (
    <div className={classes.loginContainer}>
      <h2>Login</h2>
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

        <div className={classes.formGroup}>
          <label className={classes.label} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
            placeholder="Enter your password"
            required
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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className={classes.forgotPassword}>
          <Link to="/forgot-password" className={classes.forgotPasswordLink}>
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
