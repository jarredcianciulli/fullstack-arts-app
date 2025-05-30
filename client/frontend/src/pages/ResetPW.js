import React, { useState, useEffect } from "react";
import classes from "./ResetPW.module.css";

import ResetPWRoot from "../components/public/reset_pw/ResetPWRoot";

function ResetPWPage() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 1000px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1000px)");
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    alert("Password set successfully!");
    // Call API to claim the account
  };

  return (
    <>
      <ResetPWRoot />
    </>
  );
}

export default ResetPWPage;
