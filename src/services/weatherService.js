const weatherProviders = require('../providers/weather-providers/weatherProvidersAll');
const { logProviderResponse } = require('../utils/logger');

class WeatherService {
    /**
     * Try each provider in order until one succeeds.
     * @param {string} city
     * @returns {Promise<any>}
     */

    static logPath = require('path').join(__dirname, '../../logs/weatherProvider.log');
    static loggingEnabled = true;

    // turn of logs for tests
    static setLoggingEnabled(enabled) {
        WeatherService.loggingEnabled = enabled;
    }

    // possible to pass a specific provider, or rely on the chain of responsibility
    static async fetchWeather(city, provider = null) {
        if (provider !== null)
        {
            return await provider.fetchWeather(city);
        }
        for (const provider of weatherProviders) {
            try {
                const result = await provider.fetchWeather(city);
                logProviderResponse(WeatherService.logPath, provider.name, {city, ...result});
                if (result) return result;
            } catch (err) {
                logProviderResponse(WeatherService.logPath, provider.name, {city, ...err.message }, true);
            }
        }
        throw new Error('No data available for this location');
    }
}

module.exports = WeatherService;