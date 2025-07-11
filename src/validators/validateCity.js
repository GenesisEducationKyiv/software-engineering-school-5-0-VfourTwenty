const WeatherError = require('../errors/WeatherError');

class CityValidator
{
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async validate(city)
    {
        try
        {
            await this.weatherService.fetchWeather(city);
            return true;
        }
        catch (err)
        {
            if (err.message === 'No data available for this location' || err.message === 'No matching location found.')
            {
                throw new WeatherError('INVALID CITY');
            }
            throw err;
        }
    }

}

module.exports = CityValidator;
