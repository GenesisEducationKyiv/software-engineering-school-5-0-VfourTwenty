class CityValidator
{
    constructor(getWeatherUseCase)
    {
        this.getWeatherUseCase = getWeatherUseCase;
    }

    async validate(city)
    {
        const result = await this.getWeatherUseCase.getWeather(city);
        return result.success;
    }
}

module.exports = CityValidator;
