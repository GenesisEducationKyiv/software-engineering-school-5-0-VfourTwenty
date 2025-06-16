const IProvider = require("../providerBase");

class IWeatherProvider extends IProvider
{
    async fetchWeather(city) {
        throw new Error("getData() must be implemented by subclass");
    }

    async ping() {
        try {
            const weather = await this.fetchWeather('London');

            if (
                typeof weather.temperature === 'number' &&
                typeof weather.humidity === 'number' &&
                typeof weather.description === 'string'
            ) {
                return { status: "ok", provider: this.name };
            } else {
                throw new Error("Invalid weather response format");
            }

        } catch (err) {
            return { status: "error", provider: this.name, message: err.message };
        }
    }
}

module.exports = IWeatherProvider;

