import React from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import clsx from "clsx";
import { formFieldOptions } from "../../data/form/formFieldOptions";

const CardField = ({ options, value, onChange, field_key, required, formData = {} }) => {
  const handleCardSelect = (selectedValue) => {
    onChange({
      target: {
        name: field_key,
        value: selectedValue,
        type: "select",
      },
    });
  };

  return (
    <div className={styles.card_field_container}>
      <div className={styles.card_field_body}>
        <div className={styles.card_grid}>
          {options.map((option) => {
            // Get the selected duration from the form data
            const selectedDuration = formFieldOptions.find(
              (opt) => opt.value === formData.duration
            );
            
            const durationIncrease = selectedDuration?.price_increase_per_session || 0;
            const sessionIncrease = option.price_increase_per_session
              ? option.price_increase_per_session * option.sessions
              : 0;
              
            const totalPrice = option.price + sessionIncrease + (durationIncrease * option.sessions);
            const priceWithTax = (totalPrice * 1.07).toFixed(2);

            return (
              <div
                key={option.id}
                className={clsx(styles.pricing_card, {
                  [styles.selected]: value === option.value,
                })}
                onClick={() => handleCardSelect(option.value)}
              >
                <div className={styles.card_header}>
                  <h3 className={styles.package_name}>{option.label}</h3>
                  <p className={styles.package_description}>
                    {option.description}
                  </p>
                </div>
                <div className={styles.card_content}>
                  <div className={styles.price_container}>
                    <span className={styles.price}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.package_details}>
                    <p className={styles.sessions_count}>
                      {option.sessions}{" "}
                      {option.sessions === 1 ? "Session" : "Sessions"}
                    </p>
                    <p className={styles.expiration}>
                      Expires in {option.expiration}
                    </p>
                    <p className={styles.tax_note}>${priceWithTax} with tax</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* {required && !value && (
        <span className={styles.required_message}>
          Please select a package to continue
        </span>
      )} */}
    </div>
  );
};

CardField.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      sessions: PropTypes.number.isRequired,
      expiration: PropTypes.string.isRequired,
      price_with_tax: PropTypes.number.isRequired,
      price_increase_per_session: PropTypes.number,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  field_key: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default CardField;
