import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";

const LocationField = ({ field, formData, handleInputChange, validationErrors }) => {
  const containerRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { field_key, placeholder, required } = field;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPredictions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (!showPredictions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handlePredictionSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowPredictions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleAddressChange = async (e) => {
    const query = e.target.value;

    handleInputChange({
      target: {
        name: field_key,
        value: query,
        type: "text",
      },
    });

    setSelectedIndex(-1);

    if (query.length > 2) {
      try {
        const response = await fetch(
          `http://localhost:8081/api/location/suggestions?query=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        setPredictions(data.predictions || []);
        setShowPredictions(true);
      } catch (error) {
        console.error("Error getting predictions:", error);
        setPredictions([]);
      }
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handlePredictionSelect = async (prediction) => {
    try {
      const response = await fetch("http://localhost:8081/api/location/geocode", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeId: prediction.place_id }),
      });

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();
      handleInputChange({
        target: {
          name: field_key,
          value: prediction.description,
          type: "location",
          coordinates: data.coordinates,
          distance: data.distance,
        },
      });

      setPredictions([]);
      setShowPredictions(false);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  return (
    <div ref={containerRef} className={styles.location_field_container}>
      <input
        type="text"
        name={field_key}
        placeholder={placeholder}
        value={formData[field_key] || ""}
        onChange={handleAddressChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowPredictions(true);
          }
        }}
        required={required}
        className={styles.form_input}
        autoComplete="off"
      />
      {showPredictions && predictions.length > 0 && (
        <div className={styles.predictions_container}>
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              className={`${styles.prediction_item} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => handlePredictionSelect(prediction)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
      {validationErrors[field_key] && (
        <span className={styles.error_message}>
          {validationErrors[field_key]}
        </span>
      )}
    </div>
  );
};

LocationField.propTypes = {
  field: PropTypes.shape({
    field_key: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
};

export default LocationField;
