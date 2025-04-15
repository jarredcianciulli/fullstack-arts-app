import React, { useState } from "react";
import axios from "axios";
import classes from "./Enrollment.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../../contexts/UserContext";

const stripePromise = loadStripe(
  "pk_test_51KGApaEmr68gMOioOCc6QOhgCcjAnfmyiXubcLsau5NMoDMHmD0ECJpRNZ9emJ8RJPJotcei5PdVH8ppczjZVpT8002N9kyYMG"
);

function EnrollmentsForm({ onClose }) {
  const { user } = useUser();
  console.log(user.data.data);
  const [formData, setFormData] = useState({
    whoFor: "Me",
    name: "",
    email: "",
    phone: "",
    productId: "prod_12345", // Example product ID
    package: "6-month",
    startDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sponsorId = user.data.data._id; // Replace with actual logged-in user ID

      const clientInfo =
        formData.whoFor === "Me"
          ? [{ name: "Self", email: "self@example.com", relation: "Self" }]
          : [
              {
                name: formData.name,
                email: formData.email,
                relation: formData.whoFor,
              },
            ];
      console.log(user.data.data._id);
      const requestData = {
        sponsorId,
        sponsor: user.data.data._id,
        clientInfo,
        tier: formData.package, // Renaming package to tier
        successUrl: "http://localhost:3000/success",
        cancelUrl: "http://localhost:3000/cancel",
      };

      // Send data to the backend
      const response = await axios.post(
        "http://localhost:8081/api/v1/enrollments/create",
        requestData
      );

      // Make sure response contains a valid URL
      if (response.data.url) {
        const stripe = await stripePromise;
        stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        console.error("Stripe session URL not found");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`container ${classes.form}`}>
      <button
        type="button"
        className={`btn-close ${classes.closeButton}`}
        aria-label="Close"
        onClick={onClose}
      />
      <h3 className={classes.formTitle}>Enroll Now</h3>

      <div className={`form-group ${classes.formGroup}`}>
        <label className="form-label">Who is this for?</label>
        <select
          className="form-select"
          name="whoFor"
          value={formData.whoFor}
          onChange={handleChange}
          required
        >
          <option value="Me">Me</option>
          <option value="My Friend">My Friend</option>
          <option value="My Family Member">My Family Member</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {(formData.whoFor === "My Friend" ||
        formData.whoFor === "My Family Member" ||
        formData.whoFor === "Other") && (
        <>
          <div className={`form-group ${classes.formGroup}`}>
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={`form-group ${classes.formGroup}`}>
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={`form-group ${classes.formGroup}`}>
            <label className="form-label">Phone:</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <div className={`form-group ${classes.formGroup}`}>
        <label className="form-label">Package:</label>
        <select
          className="form-select"
          name="package"
          value={formData.package}
          onChange={handleChange}
          required
        >
          <option value="4-month">4-month</option>
          <option value="6-month">6-month</option>
          <option value="12-month">12-month</option>
        </select>
      </div>

      <div className={`form-group ${classes.formGroup}`}>
        <label className="form-label">Start Date:</label>
        <input
          type="date"
          className="form-control"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary ${classes.submitButton}`}
      >
        Pay Now
      </button>
    </form>
  );
}

export default EnrollmentsForm;
