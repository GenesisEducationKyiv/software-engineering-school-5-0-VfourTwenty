const WeatherError = require('../errors/WeatherError');
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
    // possible to pass a specific provider, or rely on the chain of responsibility
    async fetchWeather(city) 
    {
        const data = await this.weatherProviderManager.fetchWeather(city);
        if (!data) 
        {
            throw new WeatherError('NO WEATHER DATA');
        }
        return data;
    }
}

module.exports = WeatherService;
