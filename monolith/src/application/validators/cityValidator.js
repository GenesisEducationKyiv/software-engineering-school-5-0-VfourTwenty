const Result = require('../../domain/types/result');

class CityValidator
{
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async validate(city)
    {
        const result = await this.weatherService.fetchWeather(city);
        if (!result.success)
        {
            return new Result(false, 'INVALID CITY');
        }
        return new Result(true);
    }
}

module.exports = CityValidator;
