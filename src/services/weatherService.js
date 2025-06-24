// mock this array for tests
const weatherProviders = require('../providers/weather-providers/weatherProvidersAll');

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

    static async fetchWeather(city) {
        for (const provider of weatherProviders) {
            try {
                const result = await provider.fetchWeather(city);
                WeatherService.logProviderResponse(provider.name, result);
                if (result) return result;
            } catch (err) {
                WeatherService.logProviderResponse(provider.name, err, true);
            }
        }
        throw new Error('No data available for this location');
    }

    static logProviderResponse(providerName, data, isError = false) {
        const logEntry = `${new Date().toISOString()} [${providerName}] ${isError ? 'Error:' : 'Response:'} ${JSON.stringify(data)}\n`;
        require('fs').appendFileSync(WeatherService.logPath, logEntry);
    }
}

module.exports = WeatherService;