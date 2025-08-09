const { handleError } = require('../../common/utils/clientErrors');

class WeatherController
{
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    getCurrentWeather = async (req, res) =>
    {
        const city = req.query.city;
        console.log('queried city: ', city);
        const result = await this.weatherService.fetchWeather(city);
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

module.exports = WeatherController;
