const { handleError } = require('../utils/errors/clientErrors');

class WeatherApiController
{
    constructor(getWeatherUseCase)
    {
        this.getWeatherUseCase = getWeatherUseCase;
    }

    getWeather = async (req, res) => 
    {
        const city = req.query.city;
        const result = await this.getWeatherUseCase.getWeather(city);
        if (!result.success)
        {
            return handleError(result.err, res);
        }
        const weather = result.data;

        return res.json({
            temperature: weather.temperature,
            humidity: weather.humidity,
            description: weather.description
        });
    };
}

module.exports = WeatherApiController;
