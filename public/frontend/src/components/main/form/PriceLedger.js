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
    (opt) => opt.value === formData.lesson_package
  );

  if (!selectedPackage) return null;

  const { price, sessions } = selectedPackage;

  // Calculate location fee if applicable
  const calculateTravelCost = () => {
    if (!formData.location?.travel_price) return 0;
    return formData.location.travel_price * sessions;
  };

  const locationFee = calculateTravelCost();
  const subtotal = price + locationFee;
  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { price, sessions, locationFee, subtotal, taxRate, tax, total };
};

const PriceLedger = ({ formData, onTotalCalculated }) => {
  const breakdown = calculatePrice(formData);
  const total = breakdown ? breakdown.total : null;

  useEffect(() => {
    if (total !== null && typeof total === 'number' && onTotalCalculated) {
      onTotalCalculated(total); // Pass the numeric total
    }
    // Dependency array includes total and the callback itself
  }, [total, onTotalCalculated]);

  if (!breakdown) return null; // Still render nothing if calculation fails
  const { price, sessions, locationFee, subtotal, tax } = breakdown; // Destructure remaining needed values

  return (
    <div className={styles.price_ledger}>
      <h4 className={styles.ledger_title}>Price Breakdown</h4>
      <div className={styles.ledger_item}>
        <span>
          Base Price ({sessions} {sessions === 1 ? "Session" : "Sessions"})
        </span>
        <span>{formatPrice(price)}</span>
      </div>
      {locationFee > 0 && (
        <div className={styles.ledger_item}>
          <span>
            Travel Fee{" "}
            {formData.location?.travel_price
              ? `($${formatPrice(formData.location.travel_price, false)} per session)`
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
    lesson_package: PropTypes.string,
    location: PropTypes.object
  }).isRequired,
  onTotalCalculated: PropTypes.func,
};

export default PriceLedger;
