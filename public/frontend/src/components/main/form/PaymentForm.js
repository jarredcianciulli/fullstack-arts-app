import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { calculatePrice } from "./PriceLedger";
import { formSteps } from "../../data/form/formSteps";

const PaymentForm = ({ formData }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/config/stripe")
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
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
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

  // --- Calculate price and payment methods (outside effects) ---
  const calculatedPrice = calculatePrice(formData);
  const amountInCents =
    calculatedPrice?.total != null
      ? Math.round(calculatedPrice.total * 100)
      : 0;

  const paymentStepConfig = formSteps.find((step) => step.title === "Payment");
  const currentPaymentMethodTypes = ["card"];
  //   if (paymentStepConfig?.affirm) {
  //     currentPaymentMethodTypes.push("affirm");
  //   }

  useEffect(() => {
    // Guard: Only run if Stripe is loaded
    if (!stripePromise || amountInCents <= 0) {
      // If stripe isn't ready or amount is invalid, clear secret and stop loading/error states
      setClientSecret("");
      setError(amountInCents <= 0 ? "Invalid amount for payment." : null);
      setLoading(false);
      return;
    }

    // --> Explicitly clear the secret to force unmount before fetching new one
    setClientSecret("");
    // Reset states for this fetch operation
    setLoading(true);
    setError(null);

    // Prepare the data payload for the backend
    // The backend now expects an object like { formData: { ...details... } }
    const dataToSend = { formData };

    // --> ADDED: Log the data being sent for debugging
    console.log('Sending data to /api/payment/create-checkout-session:', JSON.stringify(dataToSend, null, 2));

    // Fetch the checkout session
    fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // --> MODIFIED: Send the correctly structured data
      body: JSON.stringify(dataToSend),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData?.error ||
              errData?.message ||
              `Session creation failed: ${res.status}`
          );
        }
        return res.json();
      })
      .then((data) => {
        // --- ADDED DEBUG LOG --- >
        console.log("Received data from /create-checkout-session:", data);
        // <--- END DEBUG LOG ---
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("Client secret not received from server.");
        }
      })
      .catch((err) => {
        console.error("Checkout session fetch error:", err);
        setError(`Payment setup failed (session): ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stripePromise, amountInCents]);

  if (loading && !clientSecret && !error) {
    return <div>Loading Payment Options...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stripePromise || !clientSecret) {
    return <div>Initializing Payment Interface...</div>;
  }

  const options = { clientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        key={clientSecret}
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default PaymentForm;
