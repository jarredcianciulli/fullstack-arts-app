import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { FaEdit } from "react-icons/fa";
import { formFields } from "../../data/form/formFields";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const ConfirmationPage = ({ formData, onEditStep, service }) => {
  const location = useLocation();
  const [stripePromise, setStripePromise] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // For initial Stripe key load
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // For payment submission
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    // Fetch Stripe public key on component mount
    fetch('/api/payment/stripe-key') // Using relative path assuming proxy or same origin
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "Could not read error response");
          throw new Error(`Failed to fetch Stripe config: ${res.status} ${res.statusText} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.publishableKey) {
          const stripeInstance = loadStripe(data.publishableKey);
          setStripePromise(stripeInstance);
        } else {
          console.error("[ConfirmationPage] Publishable key not found in response:", data);
          setPaymentError('Failed to initialize payment system. Configuration error.');
        }
      })
      .catch((err) => {
        console.error("Stripe config error in ConfirmationPage:", err);
        setPaymentError(`Payment setup failed (config): ${err.message}`);
      })
      .finally(() => {
        setIsLoadingInitial(false);
      });
  }, []);
  // Group fields by section
  const fieldsBySection = formFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {});

  const formatFieldValue = (field, value) => {
    if (!value) return "Not provided";

    switch (field.input_type || field.type) {
      case "card":
        const option = formFieldOptions.find(
          (opt) => opt.id === parseInt(value)
        );
        return option ? `${option.title} - $${option.price}` : String(value);
      case "location":
        if (typeof value === "object" && value.address) {
          const fee =
            value.distance <= 5
              ? 15
              : value.distance <= 10
              ? 22
              : value.distance <= 20
              ? 30
              : 0;
          return `${value.address} ($${fee} travel fee per session)`;
        }
        return String(value);
      case "schedule":
        if (field.input_scope === "selector") {
          return String(value);
        }
        if (Array.isArray(value)) {
          return value
            .map((session) => `${session.day} at ${session.time}`)
            .join(", ");
        }
        try {
          const sessions = JSON.parse(value);
          return sessions
            .map((session) => `${session.day} at ${session.time}`)
            .join(", ");
        } catch {
          return String(value);
        }
      default:
        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    }
  };

  const getSectionStep = (section) => {
    switch (section) {
      case "package":
        return 1;
      case "student":
        return 2;
      case "location":
        return 3;
      case "schedule":
        return 4;
      default:
        return 1;
    }
  };

  const handlePaymentSubmit = async () => {
    if (!stripePromise || !formData || formData.totalAmount == null) { // Check for null or undefined totalAmount
      setPaymentError('Please ensure all form details are complete and total is calculated.');
      setIsProcessingPayment(false);
      return;
    }
    if (Object.keys(formData).length === 0) {
      setPaymentError('Form data is incomplete.');
      setIsProcessingPayment(false);
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Prepare form data to send to backend
      const paymentFormData = { ...formData };
      
      // Ensure schedule_selection is properly JSON stringified
      if (paymentFormData.schedule_selection && typeof paymentFormData.schedule_selection === 'object') {
        console.log('[ConfirmationPage] Converting schedule_selection to JSON string', paymentFormData.schedule_selection);
        paymentFormData.schedule_selection = JSON.stringify(paymentFormData.schedule_selection);
      }
      
      // Construct a cancel URL with all current query parameters to ensure they're preserved
      const searchParams = new URLSearchParams(location.search);
      // Add the booking ID parameter that will be created
      searchParams.append('returning', 'true'); // Add a flag to indicate the user is returning from checkout
      
      // Construct the full cancel URL with all parameters
      const cancelUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
      console.log('[ConfirmationPage] Constructed cancel_url:', cancelUrl);
      
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formData: paymentFormData,
          cancel_url: cancelUrl 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error without JSON response' }));
        console.error('[ConfirmationPage] Error creating checkout session:', errorData);
        setPaymentError(errorData.error || `Server error: ${response.status}`);
        setIsProcessingPayment(false);
        return;
      }

      const sessionData = await response.json();
      if (sessionData.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
          if (error) {
            console.error('[ConfirmationPage] Error redirecting to Stripe Checkout:', error);
            setPaymentError(error.message || 'Failed to redirect to payment page.');
            setIsProcessingPayment(false); // Only set if redirect fails
          }
          // If redirectToCheckout is successful, the user is redirected, component might unmount.
        } else {
          console.error('[ConfirmationPage] Stripe.js not loaded, cannot redirect.');
          setPaymentError('Payment system not ready. Please refresh and try again.');
          setIsProcessingPayment(false);
        }
      } else {
        console.error('[ConfirmationPage] Invalid session data received:', sessionData);
        setPaymentError('Failed to get payment session details from server.');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('[ConfirmationPage] Network or other error during payment process:', error);
      setPaymentError('Network error or server unavailable. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  if (isLoadingInitial) {
    return <p className={styles.loading_message} style={{ padding: '20px', textAlign: 'center' }}>Loading payment options...</p>;
  }

  return (
    <div className={styles.confirmation_container}>
      {Object.entries(fieldsBySection).map(([section, fields]) => (
        <div key={section} className={styles.confirmation_section}>
          <div className={styles.section_header}>
            <h3>
              {section.charAt(0).toUpperCase() + section.slice(1)} Details
            </h3>
            <button
              className={styles.edit_button}
              onClick={() => onEditStep(getSectionStep(section))}
            >
              <FaEdit /> Edit
            </button>
          </div>
          <div className={styles.section_content}>
            {fields.map((field) => {
              // Skip fields that should be hidden based on conditions
              if (
                field.visibility === "conditional" &&
                !formData[field.field_key]
              ) {
                return null;
              }

              return (
                <div key={field.id} className={styles.field_row}>
                  <div className={styles.field_label}>
                    {field.label || field.field_key}:
                  </div>
                  <div className={styles.field_value}>
                    {formatFieldValue(field, formData[field.field_key])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Payment Initiation Section */}
      <div className={styles.payment_initiation_section} style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <h4 style={{ marginBottom: '15px' }}>Ready to Complete Your Booking?</h4>
        {formData.totalAmount != null && (
          <p className={styles.final_total_display} style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '20px' }}>
            Total Amount: ${parseFloat(formData.totalAmount).toFixed(2)}
          </p>
        )}
        {paymentError && <p className={styles.payment_error_message} style={{ color: 'red', marginBottom: '10px' }}>Error: {paymentError}</p>}
        {isProcessingPayment && <p className={styles.processing_message} style={{ marginBottom: '10px' }}>Processing your payment...</p>}
        
        <button 
          onClick={handlePaymentSubmit} 
          disabled={isProcessingPayment || !stripePromise || formData.totalAmount == null}
          className={styles.proceed_to_payment_button} // You might want to add specific styles for this button
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '12px 25px', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            opacity: (isProcessingPayment || !stripePromise || formData.totalAmount == null) ? 0.6 : 1
          }}
        >
          {isProcessingPayment ? 'Processing...' : 'Proceed to Secure Payment'}
        </button>
        {!stripePromise && !paymentError && !isLoadingInitial && <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>Initializing payment system...</p>}
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  formData: PropTypes.object.isRequired,
  onEditStep: PropTypes.func.isRequired,
};

export default ConfirmationPage;
