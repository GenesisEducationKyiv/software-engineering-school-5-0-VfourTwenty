class IWeatherProvider
{
    async fetchWeather(city) {
        throw new Error("getData() must be implemented by subclass");
    }
}

module.exports = IWeatherProvider;

