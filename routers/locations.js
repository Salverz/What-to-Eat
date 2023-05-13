const express = require('express');
const router = express.Router();
const krogerAPI = require('../utils/krogerAPI');

// Render the locations page and fill the select with the store chains
router.get('/', async (req, res) => {
    if (!req.session.data.chains) {
      const chains = await krogerAPI.getChains();
      req.session.data.chains = chains.data.map(chain => {return chain.name});
    }
    res.render('locations', { "chains": req.session.data.chains });
  });

  // API endpoint for getting location search results
  router.get('/search', async (req, res) => {
    const locations = await krogerAPI.getLocations(req.query.zip, req.query.radius, req.query.chain);
    const locationData = {
        data: locations.data.map((location) => {
          return {
            locationId: location.locationId,
            address: location.address,
            name: location.name
          }
        })
      };
    res.send(locationData);
  });

  module.exports = router;