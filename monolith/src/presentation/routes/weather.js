const express = require('express');
const router = express.Router();
const { weatherApiController } = require('../../setup');

// expose the weather api endpoint
router.get('/weather', weatherApiController.getWeather);

module.exports = router;
