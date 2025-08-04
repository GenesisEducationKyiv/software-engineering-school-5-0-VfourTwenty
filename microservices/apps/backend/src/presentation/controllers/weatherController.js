const { handleError } = require('../../common/utils/clientErrors');

class WeatherController
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

        return res.status(200).json({
            temperature: weather.temperature,
            humidity: weather.humidity,
            description: weather.description
        });
    };
}

module.exports = WeatherController;
