const IWeatherProvider = require('./weatherProviderInterface');
const WeatherApiProvider = require('./weatherApiProvider');
// const { logProviderResponse } = require('../../utils/logger');
// const path = require('path');

class WeatherProviderManager extends IWeatherProvider {
    constructor() {
        super();
        this.providers = [new WeatherApiProvider() /*, add more providers here */];
        // this.logPath = path.join(__dirname, '../../../logs/weatherProvider.log');
    }

    async fetchWeather(city) {
        for (const provider of this.providers) {
            try {
                const result = await provider.fetchWeather(city);
                // logProviderResponse(this.logPath, provider.name, { city, ...result });
                if (result) return result;
            } catch (err) {
                // logProviderResponse(this.logPath, provider.name, { city, error: err }, true);
            }
        }
        throw new Error('No data available for this location');
    }
}

module.exports = WeatherProviderManager;
