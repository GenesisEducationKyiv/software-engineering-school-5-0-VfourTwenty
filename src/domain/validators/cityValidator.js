class CityValidator
{
    constructor(weatherService)
    {
        this.weatherService = weatherService;
    }

    async validate(city)
    {
        const result = await this.weatherService.fetchWeather(city);
        return result.success;
    }
}

module.exports = CityValidator;
