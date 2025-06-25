const IProvider = require("../providerBase");

class IWeatherProvider extends IProvider
{
    async fetchWeather(city) {
        throw new Error("getData() must be implemented by subclass");
    }
}

module.exports = IWeatherProvider;

