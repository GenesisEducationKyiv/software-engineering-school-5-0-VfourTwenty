const express = require("express");
const { weatherController} = require("../../../setup");

const router = express.Router();
router.get('/api/weather-current', (req, res, next) => {
    console.log('hitting /api/weather-current');
    next();
}, weatherController.getCurrentWeather);

module.exports = router;