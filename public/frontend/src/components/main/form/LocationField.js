import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";
import { calculateDistance } from "../../../utils/locationUtils";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LocationField = ({
  field,
  formData,
  handleInputChange,
  validationErrors,
}) => {
  const { id, field_key, placeholder, required, location_limit } = field;
  const [searchValue, setSearchValue] = useState(
    formData[field_key]?.address || ""
  );
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(
    formData[field_key] || null
  );

  useEffect(() => {
    if (searchValue.length > 2) {
      const timeoutId = setTimeout(() => {
        searchLocations(searchValue);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [searchValue]);

  const searchLocations = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Get place predictions from our backend
      const response = await axios.get(
        `${API_BASE_URL}/api/location/autocomplete`,
        {
          params: { query },
        }
      );

      // For each prediction, get its details to get coordinates
      const detailsPromises = response.data.map((prediction) =>
        axios.get(`${API_BASE_URL}/api/location/details/${prediction.place_id}`)
      );

      console.log("detailsPromises", detailsPromises);
      const detailsResponses = await Promise.all(detailsPromises);

      const validSuggestions = detailsResponses.map(
        (detailsResponse, index) => {
          const prediction = response.data[index];
          const details = detailsResponse.data;
          const lat = details.geometry.location.lat;
          const lng = details.geometry.location.lng;

          return {
            place_id: prediction.place_id,
            place_name: details.formatted_address,
            coordinates: [lng, lat],
            distance: calculateDistance(
              lat,
              lng,
              location_limit.coordinates[0],
              location_limit.coordinates[1]
            ),
          };
        }
      );

      setSuggestions(validSuggestions);
    } catch (err) {
      setError("Failed to fetch location suggestions");
      console.error("Location search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleLocationSelect = (suggestion) => {
    console.log("Selected location distance:", suggestion.distance);

    let travel_price = 0;
    if (suggestion.distance <= 5) {
      travel_price = 15;
    } else if (suggestion.distance <= 10) {
      travel_price = 22;
    } else if (suggestion.distance <= 20) {
      travel_price = 30;
    }
    console.log("Calculated travel price:", travel_price);

    const locationData = {
      address: suggestion.place_name,
      coordinates: suggestion.coordinates,
      distance: suggestion.distance,
      travel_price: travel_price,
    };

    console.log("Location data:", locationData);

    setSearchValue(suggestion.place_name);
    setSelectedLocation(locationData);
    setSuggestions([]);

    handleInputChange({
      target: {
        name: field_key,
        value: locationData,
        type: "location",
      },
    });
  };

  return (
    <div className={styles.location_field_wrapper}>
      <div className={styles.location_field_container}>
        <input
          id={id}
          type="text"
          name={field_key}
          placeholder={placeholder || "Enter your address"}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          required={required}
          className={styles.form_input}
          autoComplete="off"
        />
        {loading && (
          <div className={styles.loading_indicator}>Searching...</div>
        )}
        {error && <div className={styles.error_message}>{error}</div>}
        <div className={styles.suggestions_container}>
          {suggestions.length > 0 &&
            !(
              suggestions.length === 1 &&
              suggestions[0].place_name === searchValue
            ) && (
              <ul className={styles.suggestions_list}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(suggestion)}
                    className={`${styles.suggestion_item} ${
                      index === selectedIndex ? styles.selected : ""
                    }`}
                  >
                    <span className={styles.suggestion_text}>
                      {suggestion.place_name}
                    </span>
                    <div className={styles.suggestion_distance}>
                      {suggestion.distance > 20
                        ? "Out of Range (>20 miles)"
                        : `${
                            suggestion.distance <= 5
                              ? "$15"
                              : suggestion.distance <= 10
                              ? "$22"
                              : suggestion.distance <= 20
                              ? "$30"
                              : "$0"
                          } travel fee per session`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
      {selectedLocation && (
        <div className={styles.travel_price_container}>
          <div className={styles.travel_price}>
            {selectedLocation.distance > 20
              ? "Location Out of Range (>20 miles)"
              : selectedLocation.travel_price > 0
              ? `Travel Fee: $${selectedLocation.travel_price}`
              : "No Travel Fee"}
          </div>
        </div>
      )}
    </div>
  );
};

LocationField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.number.isRequired,
    field_key: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
};

export default LocationField;
