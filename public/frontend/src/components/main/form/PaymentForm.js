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

  // Calculate price and prepare payment methods
  const calculatedPrice = calculatePrice(formData);
  const amountInCents =
    calculatedPrice?.total != null
      ? Math.round(calculatedPrice.total * 100)
      : 0;

  const paymentStepConfig = formSteps.find((step) => step.title === "Payment");
  const currentPaymentMethodTypes = ["card"];

  useEffect(() => {
    if (!stripePromise || amountInCents <= 0) {
      setClientSecret("");
      setError(amountInCents <= 0 ? "Invalid amount for payment." : null);
      setLoading(false);
      return;
    }

    setClientSecret("");
    setLoading(true);
    setError(null);

    const dataToSend = { formData };

    console.log(
      "Sending data to /api/payment/create-checkout-session:",
      JSON.stringify(dataToSend, null, 2)
    );

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      }
    )
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
        console.log("Received data from /create-checkout-session:", data);
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
