class WeatherApiController
{
    constructor(getWeatherUseCase)
    {
        this.getWeatherUseCase = getWeatherUseCase;
    }

    getWeather = async (req, res) => 
    {
        const city = req.query.city;
        if (!city) 
        {
            return res.status(400).json({ error: 'City is required' });
        }
        const result = await this.getWeatherUseCase.getWeather(city);
        if (!result.success)
        {
            if (result.err === 'NO WEATHER DATA')
            {
                return res.status(404).json({ error: 'No data available for this location' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
        const weather = result.weather;
        if (
            typeof weather.temperature !== 'number' ||
            typeof weather.humidity !== 'number' ||
            typeof weather.description !== 'string'
        )
        {
            return res.status(404).json({ error: 'Invalid weather data format' });
        }
        return res.json({
            temperature: weather.temperature,
            humidity: weather.humidity,
            description: weather.description
        });
    };
}

module.exports = WeatherApiController;
