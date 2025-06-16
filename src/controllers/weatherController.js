const { fetchWeather } = require("../services/weatherService");

const weatherController = async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const data = await fetchWeather(city);

        if (
            typeof data.temperature !== 'number' ||
            typeof data.humidity !== 'number' ||
            typeof data.description !== 'string'
        ) {
            return res.status(404).json({ error: 'Invalid weather data format' });
        }

        res.json({
            temperature: data.temperature,
            humidity: data.humidity,
            description: data.description
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
}

module.exports = weatherController;