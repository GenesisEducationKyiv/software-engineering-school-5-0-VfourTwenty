class IWeatherProvider
{
    async fetchWeather(city) 
    {
        throw new Error('fetchWeather() must be implemented by subclass');
    }
}

module.exports = IWeatherProvider;

