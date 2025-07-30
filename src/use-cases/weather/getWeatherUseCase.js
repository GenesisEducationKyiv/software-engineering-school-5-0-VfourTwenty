const Result = require('../../domain/types/result');

class GetWeatherUseCase
{
    // depends on a service interface
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async getWeather(city)
    {
        if (!city) return new Result(false, 'NO CITY PROVIDED');
        return this.weatherService.fetchWeather(city);
    }
}

module.exports = GetWeatherUseCase;
