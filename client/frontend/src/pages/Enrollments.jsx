import React, { useState, useEffect } from "react";
import axios from "axios";
import EnrollmentsForm from "../components/enrollments/EnrollmentsForm";
import EnrollmentsList from "../components/enrollments/EnrollmentsList";
import classes from "./Enrollments.module.css";

function EnrollmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/enrollments"
      );
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleEnrollClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    fetchEnrollments(); // Refresh enrollments after form submission
  };

  return (
    <div className={`container ${classes.enrollmentsPage}`}>
      <div className="d-flex justify-content-end my-3">
        <button
          className={`btn btn-primary ${classes.enrollButton}`}
          onClick={handleEnrollClick}
        >
          Enroll
        </button>
      </div>

      <h2>Enrollments</h2>

      {showForm && (
        <div className={classes.modalBackdrop}>
          <div className={classes.modalContent}>
            <EnrollmentsForm onClose={handleCloseForm} />
          </div>
        </div>
      )}
      <EnrollmentsList />
    </div>
  );
}

export default EnrollmentsPage;
