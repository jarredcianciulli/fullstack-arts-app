import React from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import clsx from "clsx";

const CardField = ({ options, value, onChange, field_key, required }) => {
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
      <div className={styles.card_grid}>
        {options.map((option) => (
          <div
            key={option.id}
            className={clsx(styles.pricing_card, {
              [styles.selected]: value === option.value,
            })}
            onClick={() => handleCardSelect(option.value)}
          >
            <div className={styles.card_header}>
              <h3 className={styles.package_name}>{option.label}</h3>
              <p className={styles.package_description}>{option.description}</p>
            </div>
            <div className={styles.card_content}>
              <div className={styles.price_container}>
                <span className={styles.currency}>$</span>
                <span className={styles.price}>{option.price}</span>
              </div>
              <div className={styles.package_details}>
                <p className={styles.sessions_count}>
                  {option.sessions} {option.sessions === 1 ? "Session" : "Sessions"}
                </p>
                <p className={styles.expiration}>
                  Expires in {option.expiration}
                </p>
                <p className={styles.tax_note}>
                  ${option.price_with_tax} with tax
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {required && !value && (
        <span className={styles.required_message}>
          Please select a package to continue
        </span>
      )}
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
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  field_key: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default CardField;
