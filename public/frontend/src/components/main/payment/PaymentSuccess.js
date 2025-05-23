import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const [bookingId, setBookingId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sId = queryParams.get('session_id');
    const bId = queryParams.get('booking_id');

    console.log('[PaymentSuccess] Query Params:', location.search);
    console.log('[PaymentSuccess] Extracted session_id:', sId);
    console.log('[PaymentSuccess] Extracted booking_id:', bId);

    if (sId && bId) {
      setSessionId(sId);
      setBookingId(bId);
      // Make an API call to your backend to verify the session
      // and update the booking status.
      fetch(`/api/payment/verify-session?session_id=${sId}&booking_id=${bId}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response from server.' }));
            throw new Error(errorData.message || `Server error: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if(data.success) {
            console.log('[PaymentSuccess] Payment verified and booking updated:', data.booking);
            // Optionally, you could update local state if needed, but for now, a success message is sufficient.
          } else {
            setError(data.message || 'Failed to verify payment with backend.');
          }
        })
        .catch(err => {
          console.error('[PaymentSuccess] Error verifying payment:', err);
          setError(err.message || 'An error occurred while verifying your payment.');
        })
        .finally(() => setIsLoading(false));
    } else {
      console.error('[PaymentSuccess] Missing session_id or booking_id in URL.');
      setError('Payment confirmation details are missing. Please contact support.');
      setIsLoading(false);
    }
  }, [location.search]);

  if (isLoading) {
    return <p>Verifying your payment, please wait...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Payment Confirmation Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>If you believe this is an error, please contact our support team with your booking details.</p>
        <Link to="/">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h2>Payment Successful!</h2>
      <p>Thank you for your booking. Your payment has been processed successfully.</p>
      {bookingId && <p>Your Booking ID is: <strong>{bookingId}</strong></p>}
      {sessionId && <p>Your Payment Session ID is: <strong>{sessionId}</strong></p>}
      <p>You should receive a confirmation email shortly with your booking details.</p>
      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Back to Homepage
        </Link>
        {/* You could also add a link to a user dashboard or bookings page */}
        {/* <Link to="/my-bookings" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          View My Bookings
        </Link> */}
      </div>
    </div>
  );
};

export default PaymentSuccess;
