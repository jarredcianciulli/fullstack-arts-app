import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const formatPrice = (price, includeSymbol = true) => {
  const formatted = parseFloat(price).toFixed(2);
  return includeSymbol ? `$${formatted}` : formatted;
};

export const calculatePrice = (formData) => {
  // Find the selected package
  const selectedPackage = formFieldOptions.find(
    (opt) => opt.value === formData.package
  );

  if (!selectedPackage) return null;

  let { price, sessions } = selectedPackage;
  
  // Get the selected duration and its price increase
  const selectedDuration = formFieldOptions.find(
    (opt) => opt.value === formData.duration
  );
  
  const durationPriceIncrease = selectedDuration?.price_increase_per_session || 0;
  const totalDurationIncrease = durationPriceIncrease * sessions;

  // Calculate price increase per session if applicable
  const sessionIncrease = selectedPackage.price_increase_per_session
    ? selectedPackage.price_increase_per_session * sessions
    : 0;

  // Calculate location fee if applicable
  const calculateTravelCost = () => {
    if (!formData.location?.travel_price) return 0;
    return formData.location.travel_price * sessions;
  };

  const locationFee = calculateTravelCost();
  const subtotal = price + sessionIncrease + totalDurationIncrease + locationFee;
  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Calculate the total base price including duration increase
  const basePriceWithIncrease = price + totalDurationIncrease;
  
  return {
    price: basePriceWithIncrease, // Include duration increase in base price
    sessions,
    sessionIncrease,
    locationFee,
    subtotal,
    taxRate,
    tax,
    total,
  };
};

const PriceLedger = ({ formData, onTotalCalculated }) => {
  console.log(formData, "formData in PriceLedger");
  // Get the selected duration for display
  const selectedDuration = formFieldOptions.find(
    (opt) => opt.value === formData.duration
  );
  
  const breakdown = calculatePrice(formData);
  const total = breakdown ? breakdown.total : null;

  useEffect(() => {
    if (total !== null && typeof total === "number" && onTotalCalculated) {
      onTotalCalculated(total); // Pass the numeric total
    }
    // Dependency array includes total and the callback itself
  }, [total, onTotalCalculated]);

  if (!breakdown) return null; // Still render nothing if calculation fails
  const { price, sessions, sessionIncrease, locationFee, subtotal, tax } =
    breakdown; // Destructure remaining needed values

  return (
    <div className={styles.price_ledger}>
      <h4 className={styles.ledger_title}>Price Breakdown</h4>
      <div className={styles.ledger_item}>
        <span>
          Base Price ({sessions} {sessions === 1 ? "Session" : "Sessions"})
          {selectedDuration?.price_increase_per_session > 0 && (
            <span className={styles.price_increase_note}>
              (includes ${selectedDuration.price_increase_per_session}/session for {selectedDuration.value})
            </span>
          )}
        </span>
        <span>{formatPrice(price)}</span>
      </div>
      {sessionIncrease > 0 && (
        <div className={styles.ledger_item}>
          <span>
            Price Increase Per Session{" "}
            {formFieldOptions.find((opt) => opt.value === formData.package)
              ?.price_increase_per_session
              ? `($${formatPrice(
                  formFieldOptions.find((opt) => opt.value === formData.package)
                    .price_increase_per_session,
                  false
                )} per session)`
              : ""}
          </span>
          <span>{formatPrice(sessionIncrease)}</span>
        </div>
      )}
      {locationFee > 0 && (
        <div className={styles.ledger_item}>
          <span>
            Travel Fee{" "}
            {formData.location?.travel_price
              ? `($${formatPrice(
                  formData.location.travel_price,
                  false
                )} per session)`
              : ""}
          </span>
          <span>{formatPrice(locationFee)}</span>
        </div>
      )}
      <div className={`${styles.ledger_item} ${styles.subtotal}`}>
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.ledger_item}>
        <span>Tax (7%)</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className={`${styles.ledger_item} ${styles.total}`}>
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
};

PriceLedger.propTypes = {
  formData: PropTypes.shape({
    package: PropTypes.string,
    location: PropTypes.object,
  }).isRequired,
  onTotalCalculated: PropTypes.func,
};

export default PriceLedger;
