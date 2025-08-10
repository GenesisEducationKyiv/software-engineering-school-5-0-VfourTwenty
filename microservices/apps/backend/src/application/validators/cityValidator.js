const Result = require('../../common/utils/result');

class CityValidator
{
    constructor(weatherService, logger)
    {
        this.weatherService = weatherService;
        this.log = logger.for('CityValidator');
    }

    async validate(city)
    {
        const result = await this.weatherService.fetchWeather(city);
        this.log.info('Validated a city:', { city, result });
        if (!result.success)
        {
            return new Result(false, 'INVALID CITY');
        }
        return new Result(true);
    }
}

module.exports = CityValidator;
