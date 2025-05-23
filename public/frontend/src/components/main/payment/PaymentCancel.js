import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentCancel = () => {
  const location = useLocation();
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bId = queryParams.get('booking_id');
    console.log('[PaymentCancel] Query Params:', location.search);
    console.log('[PaymentCancel] Extracted booking_id:', bId);
    if (bId) {
      setBookingId(bId);
      // You could potentially use this bookingId to allow the user to quickly restart
      // the payment for this specific booking, or clear the pending payment status on the backend.
    }
  }, [location.search]);

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h2>Payment Canceled</h2>
      <p>Your payment process was canceled or was not completed.</p>
      {bookingId && (
        <p>
          This was for Booking ID: <strong>{bookingId}</strong>.
        </p>
      )}
      <p>If you'd like to try again, you can return to the booking form.</p>
      <div style={{ marginTop: '30px' }}>
        {/* Adjust the '/booking' link to your actual booking form route if different */}
        <Link 
          to="/booking" 
          style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px', marginRight: '10px' }}
        >
          Try Payment Again
        </Link>
        <Link 
          to="/"
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          Go to Homepage
        </Link>
      </div>
      <p style={{ marginTop: '20px', fontSize: '0.9em', color: 'gray' }}>
        If you encountered any issues or have questions, please contact our support team.
      </p>
    </div>
  );
};

export default PaymentCancel;
