import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AccountClaim.module.css";
import { claimAccount } from "../../utils/http";
a
function AccountClaim({ inviteToken }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

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
      await claimAccount({ inviteToken, password, passwordConfirm });
      setSuccessMessage("Account successfully claimed!");

      // Redirect to /login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.info?.message || "Failed to claim account.");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Claim Your Account</h2>
        <p className={classes.description}>
          Set your password to activate your account.
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
            Claim Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountClaim;
