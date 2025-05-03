import React from "react";
import PropTypes from "prop-types";
import { formFieldOptions } from "../../data/form/formFieldOptions";
import { formFields } from "../../data/form/formFields";
import styles from "./Form.module.css";

const PriceLedger = ({ formData }) => {
  // Get selected package details
  const selectedPackage = formFieldOptions.find(
    (opt) => opt.value === formData.lesson_package
  );

  // Get location field config
  const locationField = formFields.find((field) => field.field_key === "location");

  // Calculate additional location fee if applicable
  let locationFee = 0;
  if (formData.location?.distance && locationField?.location_pricing) {
    // Find the applicable pricing tier based on distance
    const pricingTier = locationField.location_pricing.find(
      (tier) => formData.location.distance <= tier.radius_miles
    );
    if (pricingTier) {
      locationFee = pricingTier.additional_price;
    }
  }

  // Calculate totals
  const subtotal = selectedPackage.price;
  const tax = selectedPackage.price_with_tax - selectedPackage.price;
  const total = selectedPackage.price_with_tax + locationFee;

  return (
    <div className={styles.price_ledger}>
      <h4 className={styles.price_ledger_title}>Price Summary</h4>
      <div className={styles.price_ledger_content}>
        <div className={styles.price_ledger_row}>
          <span>{selectedPackage.description}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {locationFee > 0 && (
          <div className={styles.price_ledger_row}>
            <span>Travel Fee</span>
            <span>${locationFee.toFixed(2)}</span>
          </div>
        )}
        <div className={styles.price_ledger_row}>
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className={`${styles.price_ledger_row} ${styles.price_ledger_total}`}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className={styles.price_ledger_info}>
          <p>Package expires in {selectedPackage.expiration}</p>
          <p>{selectedPackage.sessions} sessions included</p>
        </div>
      </div>
    </div>
  );
};

PriceLedger.propTypes = {
  formData: PropTypes.shape({
    lesson_package: PropTypes.string.isRequired,
    location: PropTypes.shape({
      distance: PropTypes.number,
    }),
  }).isRequired,
};

export default PriceLedger;
