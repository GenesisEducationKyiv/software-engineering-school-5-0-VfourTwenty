const DTO = require('../../types/dto');

class GetWeatherUseCase
{
    // depends on a service interface
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async getWeather(city)
    {
        if (!city) return new DTO(false, 'NO CITY PROVIDED');
        return this.weatherService.fetchWeather(city);
    }
}

module.exports = GetWeatherUseCase;
