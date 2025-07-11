// const { logProviderResponse } = require('../utils/logger');

class WeatherService 
{
    weatherProviderManager;

    constructor(weatherProviderManager) 
    {
        this.weatherProviderManager = weatherProviderManager;
    }

    /**
     * Try each provider in order until one succeeds.
     * @param {string} city
     * @returns {Promise<any>}
     */

    // logPath = require('path').join(__dirname, '../../logs/weatherProvider.log');
    // loggingEnabled = true;

    // // turn of logs for tests
    // setLoggingEnabled(enabled) {
    //     this.loggingEnabled = enabled;
    // }

    // possible to pass a specific provider, or rely on the chain of responsibility
    async fetchWeather(city) 
    {
        return this.weatherProviderManager.fetchWeather(city);
    }
}

module.exports = WeatherService;
