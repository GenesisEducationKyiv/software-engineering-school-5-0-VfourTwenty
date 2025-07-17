class GetWeatherUseCase
{
    // depends on a service interface
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async getWeather(city)
    {
        return this.weatherService.fetchWeather(city);
    }
}

module.exports = GetWeatherUseCase;
