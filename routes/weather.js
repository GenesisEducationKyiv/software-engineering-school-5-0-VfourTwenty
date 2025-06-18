const express = require('express');
const router = express.Router();

require('dotenv').config();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// expose the weather api endpoint
router.get('/weather', async (req, res) => 
{
    const city = req.query.city;
    if (!city) 
    {
        return res.status(400).json({ error: 'City is required' });
    }

    try 
    {
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
        const response = await fetch(url);

        const data = await response.json();
        if (data.error) 
        {
            return res.status(404).json({ error: data.error.message });
        }
        const current = data.current;

        res.json({
            temperature: current.temp_c,
            humidity: current.humidity,
            description: current.condition.text
        });
    }
    catch (err) 
    {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;
