import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { calculatePrice } from "./PriceLedger";
import { formSteps } from "../../data/form/formSteps";

const PaymentForm = ({ formData }) => {
  const [stripePromise, setStripePromise] = useState(null); // Initialize stripePromise
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReadyForEmbeddedCheckout, setIsReadyForEmbeddedCheckout] = useState(false);

  // Fetch Stripe public key on component mount
  useEffect(() => {
    setLoading(true);
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
          const loadedStripePromise = loadStripe(data.publishableKey);
          console.log("[PaymentForm] loadStripe called. Promise object:", loadedStripePromise);
          loadedStripePromise.then(stripeInstance => {
            console.log("[PaymentForm] Stripe.js instance loaded:", stripeInstance);
          });
          setStripePromise(loadedStripePromise);
        } else {
          throw new Error("Stripe publishableKey not received");
        }
      })
      .catch((err) => {
        console.error("Stripe config error:", err);
        setError(`Payment setup failed (config): ${err.message}`);
        setLoading(false);
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

  // Effect to fetch client secret for Embedded Checkout
  useEffect(() => {
    if (!stripePromise || amountInCents <= 0) {
      if (amountInCents <= 0 && calculatedPrice?.total !== null) { // Only set error if amount is truly invalid, not just initially 0
        setError("Invalid amount for payment. Amount must be greater than 0.");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    setClientSecret(''); // Clear previous client secret

    // Prepare data to send to backend. Ensure all required fields are present.
    // The backend /create-payment-intent expects 'formData' which includes 'totalAmount'
    // and other booking details.
    const dataToSend = {
      formData: {
        ...formData,
        totalAmount: calculatedPrice?.total, // Ensure totalAmount is what's calculated
        currency: "usd", // Or get from formData if available
      },
    };

    console.log(
      "[PaymentForm] Sending data to /api/payment/create-payment-intent:",
      JSON.stringify(dataToSend, null, 2)
    );

    console.log("[PaymentForm] Initiating fetch for client secret.");
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/payment/create-payment-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      }
    )
      .then(async (res) => {
        console.log("[PaymentForm] Response status from /create-payment-intent:", res.status);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({})); // Attempt to parse error JSON
          console.error("[PaymentForm] Error response body from backend:", errData);
          throw new Error(
            errData?.error || // Use error message from backend if available
              errData?.message ||
              `Failed to create Payment Intent: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("[PaymentForm] Received data object from /create-payment-intent:", data); // CRITICAL LOG
        if (data && data.clientSecret && typeof data.clientSecret === 'string' && data.clientSecret.trim() !== '') {
          console.log("[PaymentForm] Valid clientSecret received:", data.clientSecret);
          setClientSecret(data.clientSecret);
          // Optionally, store bookingId if needed for UI updates post-payment on client-side
          // e.g., setBookingId(data.bookingId);

          // --- DEBUG: Attempt to retrieve PaymentIntent directly ---
          if (stripePromise && data.clientSecret) {
            stripePromise.then(stripe => {
              if (stripe) { // Ensure stripe instance is available
                console.log('[PaymentForm] Attempting to retrieve PI with clientSecret:', data.clientSecret);
                stripe.retrievePaymentIntent(data.clientSecret).then(result => {
                  if (result.error) {
                    console.error('[PaymentForm] Error retrieving PI with clientSecret:', result.error.message);
                    setError(`Debug - Failed to validate client secret with Stripe: ${result.error.message}`);
                  } else {
                    console.log('[PaymentForm] Successfully retrieved PI with clientSecret (debug):', result.paymentIntent);
                    // If this works, the clientSecret is valid for basic operations.
                    setIsReadyForEmbeddedCheckout(true); // Enable rendering for EmbeddedCheckoutProvider
                  }
                });
              } else {
                console.error('[PaymentForm] Stripe instance not available for retrievePaymentIntent (debug)');
              }
            }).catch(err => {
              console.error('[PaymentForm] Error in stripePromise chain for retrievePaymentIntent (debug):', err);
            });
          }
          // --- END DEBUG ---
        } else {
          console.error(
            "[PaymentForm] Invalid or missing clientSecret in response from backend. Data received:",
            data
          );
          setError(
            "Payment setup failed: Client secret not received or invalid from server."
          );
          // Explicitly set clientSecret to empty string if it's bad to prevent Stripe.js error with invalid secret
          setClientSecret(''); 
        }
      })
      .catch((err) => {
        console.error("[PaymentForm] Error during fetch or processing of client secret:", err);
        setError(`Payment setup failed: ${err.message}`);
        setClientSecret(''); // Ensure clientSecret is cleared on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stripePromise, amountInCents, formData, calculatedPrice?.total]);

  useEffect(() => {
    console.log("[PaymentForm] clientSecret state updated:", clientSecret);
  }, [clientSecret]);

  // Show loading state if actively fetching/initializing or if stripePromise isn't loaded yet
  if (!stripePromise || (loading && !clientSecret && !error)) {
    return <div>Loading Payment Options...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure clientSecret is a non-empty string AND we are ready for embedded checkout
  if (!isReadyForEmbeddedCheckout || !stripePromise || typeof clientSecret !== 'string' || clientSecret.trim() === '') {
    console.log("[PaymentForm] Rendering 'Initializing Payment Interface...' because: stripePromise exists=", !!stripePromise, "clientSecret value=", clientSecret);

    return <div>Initializing Payment Interface...</div>;
  }

  // Options should only be defined if clientSecret is valid and present
  // Options should only be defined if clientSecret is valid and present (already ensured by isReadyForEmbeddedCheckout)
  const options = { clientSecret };

  console.log("[PaymentForm] Rendering EmbeddedCheckoutProvider with clientSecret:", clientSecret, "and options:", options);
  return (
    <div id="checkout">
      {isReadyForEmbeddedCheckout && stripePromise && options ? (
        <EmbeddedCheckoutProvider
          key={clientSecret} // Forces re-mount on clientSecret change
          stripe={stripePromise}
          options={options} // options now strictly conditional
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div>Preparing payment provider... Stripe: {stripePromise ? 'Loaded' : 'Not Loaded'}, Options: {options ? 'Set' : 'Not Set'}</div>
      )}
    </div>
  );
};

export default PaymentForm;
