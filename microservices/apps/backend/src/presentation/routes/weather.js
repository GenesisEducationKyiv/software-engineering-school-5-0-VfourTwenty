const express = require('express');
const weatherRouter = express.Router();
const { weatherController } = require('../../../setup');

// expose the weather api endpoint
weatherRouter.get('/weather', weatherController.getWeather);

module.exports = weatherRouter;
