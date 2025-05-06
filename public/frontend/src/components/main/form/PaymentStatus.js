import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Form.module.css"; // Reuse form styles for now

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentStatus = () => {
  const query = useQuery();
  const [status, setStatus] = useState("loading"); // loading, success, error, canceled
  const [sessionId, setSessionId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const sessionIdFromUrl = query.get("session_id");
    const bookingIdFromUrl = query.get("booking_id");

    setSessionId(sessionIdFromUrl);
    setBookingId(bookingIdFromUrl);

    if (!sessionIdFromUrl) {
      setStatus("error");
      setErrorMsg("Missing payment session information.");
      return;
    }

    // TODO: Optionally, verify session status with backend
    // For now, assume success if session_id exists
    // A real implementation should fetch `/api/payment/session-status?session_id=...`
    // The backend would query Stripe: `stripe.checkout.sessions.retrieve(sessionIdFromUrl)`
    // and return { status: session.status, payment_status: session.payment_status }

    // Simulating success for now
    setStatus("success"); // Or 'canceled' based on backend check
  }, [query]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return <p>Verifying payment status...</p>;
      case "success":
        return (
          <div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your booking!</p>
            <p>Your Booking ID: {bookingId || "N/A"}</p>

            <p className={styles.form_p}>
              A confirmation email will be sent shortly.
            </p>

            <div className={styles.form_actions}>
              <Link to="/" className={styles.btn_primary}>
                Return Home
              </Link>
            </div>
          </div>
        );
      case "canceled":
        return (
          <div>
            <h2>Payment Canceled</h2>
            <p>Your payment process was canceled. You have not been charged.</p>
            <p>Your Booking ID (if created): {bookingId || "N/A"}</p>
            <Link to="/" className={styles.btn_primary}>
              Return Home
            </Link>
          </div>
        );
      case "error":
      default:
        return (
          <div className={styles.form_container}>
            <h2>Payment Error</h2>
            <p>
              There was an issue processing your payment or verifying the
              status.
            </p>
            <div className={styles.form_message}>
              <p className={styles.form_p}>{errorMsg}</p>
            </div>
            <div className={styles.form_actions}>
              <Link to="/" className={styles.btn_primary}>
                Return Home
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.payment_status_container}>
      {" "}
      {/* Add specific styles if needed */}
      {renderContent()}
    </div>
  );
};

export default PaymentStatus;
