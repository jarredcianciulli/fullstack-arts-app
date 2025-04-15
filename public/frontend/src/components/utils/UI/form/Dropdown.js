import React from "react";
import PropTypes from "prop-types";
import "./Dropdown.css";

const Dropdown = ({ options, label, onSelect, value }) => {
  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <select
        value={value} // Use the `value` prop to control the selected option
        onChange={handleChange}
        className="dropdown-select"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// Define prop types for the Dropdown component
Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired, // Add `value` prop type
};

export default Dropdown;
