const Result = require('../../common/utils/result');

class GetWeatherUseCase
{
    // depends on a service interface
    constructor(weatherService, logger)
    {
        this.weatherService = weatherService;
        this.log = logger.for('GetWeatherUseCase');
    }

    async getWeather(city)
    {
        if (!city) return new Result(false, 'NO CITY PROVIDED');
        // fetch from weather service
        const result = this.weatherService.fetchWeather(city);
        this.log.info(`Weather fetch result for ${city}`, result);
        return result;
    }
}

module.exports = GetWeatherUseCase;
