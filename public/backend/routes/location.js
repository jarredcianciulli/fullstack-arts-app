const express = require('express');
const router = express.Router();
const axios = require('axios');

// Google Places API key
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Debug middleware for all routes
router.use((req, res, next) => {
  console.log(`[Location Route] ${req.method} ${req.originalUrl}`);
  next();
});

// Endpoint for place autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('[Autocomplete] Query:', query);
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = {
      input: query,
      key: apiKey,
      components: 'country:us',
      types: 'address'
    };

    console.log('[Autocomplete] Making request to Google Places API');
    const response = await axios.get(url, { params });
    console.log('[Autocomplete] Google API response status:', response.data.status);
    
    if (response.data.status !== 'OK') {
      console.error('Google Places API error:', response.data);
      return res.status(500).json({ error: 'Failed to fetch suggestions' });
    }

    // Transform the predictions to match frontend expectations
    const predictions = response.data.predictions.map(prediction => ({
      place_id: prediction.place_id,
      description: prediction.description
    }));

    console.log('[Autocomplete] Sending predictions:', predictions);
    res.json(predictions);
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for place details
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = {
      place_id: placeId,
      key: apiKey,
      fields: 'formatted_address,geometry'
    };

    const response = await axios.get(url, { params });

    if (response.data.status !== 'OK') {
      console.error('Google Places API error:', response.data);
      return res.status(500).json({ error: 'Failed to fetch place details' });
    }

    const { result } = response.data;
    res.json({
      formatted_address: result.formatted_address,
      geometry: result.geometry
    });
  } catch (error) {
    console.error('Error in place details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
