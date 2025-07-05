const express = require('express');
const router = express.Router();
const WeatherController = require('../controllers/weatherApiController');


// expose the weather api endpoint
// mount city validation here
router.get('/weather', WeatherController.getWeather);

module.exports = router;
