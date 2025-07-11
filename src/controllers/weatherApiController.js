class WeatherApiController
{
    weatherService;

    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    getWeather = async (req, res) => {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        try {
            const data = await this.weatherService.fetchWeather(city);
            console.log(data);

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
            if (err.message === 'No matching location found.')
            {
                res.status(404).json({error: err.message});
            }
            else
            {
                res.status(500).json({ error: err.message });
            }
        }
    }
}

module.exports = WeatherApiController;