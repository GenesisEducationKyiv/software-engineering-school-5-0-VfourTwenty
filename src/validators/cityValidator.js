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
            console.log('City validation error: ', err.message);
            return false;
        }
    }
}

module.exports = CityValidator;
