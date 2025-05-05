import React from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const formatPrice = (price, includeSymbol = true) => {
  const formatted = parseFloat(price).toFixed(2);
  return includeSymbol ? `$${formatted}` : formatted;
};

const PriceLedger = ({ formData }) => {
  // Find the selected package
  const selectedPackage = formFieldOptions.find(
    (opt) => opt.value === formData.lesson_package
  );

  if (!selectedPackage) return null;

  // Get base price and sessions
  const { price, sessions } = selectedPackage;

  // Calculate location fee if applicable
  const calculateTravelCost = () => {
    if (!formData.location?.travel_price) return 0;
    return formData.location.travel_price * sessions;
  };

  const locationFee = calculateTravelCost();

  // Calculate subtotal and tax
  const subtotal = price + locationFee;
  const taxRate = 0.07; // 7% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

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
  }).isRequired,
};

export default PriceLedger;
