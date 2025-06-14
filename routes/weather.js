const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');


// expose the weather api endpoint
router.get('/weather', weatherController);

module.exports = router;
