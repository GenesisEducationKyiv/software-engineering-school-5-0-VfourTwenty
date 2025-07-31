class IWeatherService
{
    constructor(weatherProvider)
    {
        this.weatherProvider = weatherProvider;
    }

    async fetchWeather(city)
    {
        throw new Error('fetchWeather() must be implemented by subclass');
    }
}

module.exports = IWeatherService;
