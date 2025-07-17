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

        try 
        {
            const weather = await this.getWeatherUseCase.getWeather(city);
            console.log(weather);

            if (
                typeof weather.temperature !== 'number' ||
                typeof weather.humidity !== 'number' ||
                typeof weather.description !== 'string'
            )
            {
                return res.status(404).json({ error: 'Invalid weather data format' });
            }

            res.json({
                temperature: weather.temperature,
                humidity: weather.humidity,
                description: weather.description
            });
        }
        catch (err) 
        {
            if (err.message === 'NO WEATHER DATA') 
            {
                res.status(404).json({ error: 'No data available for this location' });
            }
            else 
            {
                res.status(500).json({ error: err.message });
            }
        }
    };
}

module.exports = WeatherApiController;
