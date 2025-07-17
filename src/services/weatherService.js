const WeatherError = require('../domain/errors/WeatherError');
// const { logProviderResponse } = require('../utils/logger');

class WeatherService 
{
    constructor(weatherProviderManager) 
    {
        this.weatherProviderManager = weatherProviderManager;
    }

    /**
     * Try each provider in order until one succeeds.
     * @param {string} city
     * @returns {Promise<any>}
     */
    async fetchWeather(city) 
    {
        const weather = await this.weatherProviderManager.fetchWeather(city);
        // all providers have failed
        if (!weather)
        {
            throw new WeatherError('NO WEATHER DATA');
        }
        return weather;
    }
}

module.exports = WeatherService;
