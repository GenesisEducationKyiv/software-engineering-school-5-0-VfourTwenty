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
        // try
        // {
        //     await this.weatherService.fetchWeather(city);
        //     return true;
        // }
        // catch (err)
        // {
        //     console.log('City validation error: ', err.message);
        //     return false;
        // }
    }
}

module.exports = CityValidator;
