import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { calculatePrice } from "./PriceLedger";
import { formSteps } from "../../data/form/formSteps";

const PaymentForm = ({ formData }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [bookingId, setBookingId] = useState(null); 
  const [paymentError, setPaymentError] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Set to true initially

  // Fetch Stripe public key on component mount
  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payment/stripe-key`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res
            .text()
            .catch(() => "Could not read error response");
          throw new Error(
            `Failed to fetch Stripe config: ${res.status} ${res.statusText} - ${text}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("[PaymentForm] Received from /api/payment/stripe-key:", data);
        if (data.publishableKey) {
          console.log("[PaymentForm] Using publishableKey for loadStripe:", data.publishableKey);
          const stripeInstance = loadStripe(data.publishableKey);
          console.log("[PaymentForm] loadStripe called. Promise object:", stripeInstance);
          stripeInstance.then(stripeObj => {
            console.log("[PaymentForm] Stripe.js instance loaded:", stripeObj);
            setIsLoading(false); // Stripe loaded, ready for form submission
          }).catch(error => {
            console.error("[PaymentForm] Error loading Stripe.js:", error);
            setPaymentError('Failed to load payment library. Please try again.');
            setIsLoading(false);
          });
          setStripePromise(stripeInstance);
        } else {
          console.error("[PaymentForm] Publishable key not found in response:", data);
          setPaymentError('Failed to initialize payment system. Configuration error.');
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Stripe config error:", err);
        setPaymentError(`Payment setup failed (config): ${err.message}`);
        setIsLoading(false);
      });
  }, []);

  // Calculate price and prepare payment methods
  const calculatedPrice = calculatePrice(formData);
  const amountInCents =
    calculatedPrice?.total != null
      ? Math.round(calculatedPrice.total * 100)
      : 0;

  const paymentStepConfig = formSteps.find((step) => step.title === "Payment");
  const currentPaymentMethodTypes = ["card"];

  // Function to handle payment submission
  const handlePaymentSubmit = async () => {
    if (!stripePromise || !formData || !calculatedPrice?.total || isLoading) {
      console.log('[PaymentForm] Payment submission skipped due to missing dependencies or loading state.');
      setPaymentError('Please ensure all form details are complete and try again.');
      return;
    }
    if (Object.keys(formData).length === 0) {
      console.log('[PaymentForm] Skipping payment: formData is empty.');
      setPaymentError('Form data is incomplete.');
      return;
    }

    setIsLoading(true);
    setPaymentError(null);
    console.log('[PaymentForm] Initiating payment process. Sending data to /api/payment/create-checkout-session:', { formData });

    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      console.log('[PaymentForm] Response status from /create-checkout-session:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PaymentForm] Error creating checkout session:', errorData);
        setPaymentError(errorData.error || `Server error: ${response.status}`);
        setIsLoading(false);
        return;
      }

      const sessionData = await response.json();
      console.log('[PaymentForm] Received session data from /create-checkout-session:', sessionData);

      if (sessionData.sessionId && sessionData.bookingId) {
        setBookingId(sessionData.bookingId); // Store bookingId if needed later, though success page will also get it
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
          if (error) {
            console.error('[PaymentForm] Error redirecting to Stripe Checkout:', error);
            setPaymentError(error.message || 'Failed to redirect to payment page.');
            setIsLoading(false);
          }
          // If redirectToCheckout is successful, the user is redirected, so no further action here.
        } else {
          console.error('[PaymentForm] Stripe.js not loaded, cannot redirect.');
          setPaymentError('Payment system not ready. Please refresh and try again.');
          setIsLoading(false);
        }
      } else {
        console.error('[PaymentForm] Invalid session data received (missing sessionId or bookingId):', sessionData);
        setPaymentError('Failed to get payment session details from server.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[PaymentForm] Network or other error during payment process:', error);
      setPaymentError('Network error or server unavailable. Please try again.');
      setIsLoading(false);
    }
    // No need to setIsLoading(false) here if redirect is successful, as the component will unmount.
  };

  useEffect(() => {
    console.log('[PaymentForm] bookingId state updated:', bookingId);
  }, [bookingId]);

  if (!stripePromise || isLoading) {
    let statusMessage = 'Loading payment configuration...';
    if (stripePromise && isLoading && !paymentError) statusMessage = 'Preparing payment options...';
    if (paymentError) statusMessage = ''; // Error message will be shown by paymentError display
    return (
      <div>
        {statusMessage && <p>{statusMessage}</p>}
        {paymentError && <p style={{ color: 'red' }}>Error: {paymentError}</p>}
      </div>
    );
  }

  return (
    <div id="payment-form-container">
      <h3>Complete Your Booking</h3>
      {paymentError && <p style={{ color: 'red' }}>Error: {paymentError}</p>}
      {isLoading && <p>Processing your request...</p>}
      
      {/* 
        IMPORTANT: You need a button or some other trigger to call handlePaymentSubmit().
        For example:
        <button onClick={handlePaymentSubmit} disabled={isLoading || !stripePromise}>
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      */}
      
      {!isLoading && !paymentError && (
        <p>
          Please click the button below to proceed to our secure payment page.
          {/* This is a placeholder. Replace with your actual payment button. */}
          <button 
            onClick={handlePaymentSubmit} 
            disabled={isLoading || !stripePromise || !formData || Object.keys(formData).length === 0 || !calculatedPrice?.total}
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
          >
            {isLoading ? 'Processing...' : 'Proceed to Secure Payment'}
          </button>
        </p>
      )}
      {(!formData || Object.keys(formData).length === 0 || !calculatedPrice?.total) && !isLoading && !paymentError && (
        <p style={{color: 'orange'}}>Please ensure all booking details are finalized before proceeding to payment.</p>
      )}
    </div>
  );
};

export default PaymentForm;
