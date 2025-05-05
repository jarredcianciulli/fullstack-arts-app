const express = require('express');
const router = express.Router();
const axios = require('axios');

// Google Places API key
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Endpoint for place autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Query:', query);
    console.log('API Key:', apiKey);

    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    console.log('Making request to:', url);

    const params = {
      input: query,
      key: apiKey,
      components: 'country:us',
      types: 'address'
    };
    console.log('With params:', params);

    const response = await axios.get(url, { params });
    console.log('Response status:', response.data.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    // Extract relevant information from predictions
    const predictions = response.data.predictions.map(prediction => ({
      place_id: prediction.place_id,
      description: prediction.description
    }));

    console.log('Sending predictions:', predictions);
    res.json(predictions);
  } catch (error) {
    console.error('Error in /autocomplete:', error);
    res.status(500).json({ 
      message: 'Error fetching location suggestions',
      error: error.message 
    });
  }
});

// Endpoint for place details
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: apiKey,
        fields: 'formatted_address,geometry'
      }
    });

    res.json(response.data.result);
  } catch (error) {
    console.error('Error in /details:', error);
    res.status(500).json({ 
      message: 'Error fetching location details',
      error: error.message 
    });
  }
});

module.exports = router;
