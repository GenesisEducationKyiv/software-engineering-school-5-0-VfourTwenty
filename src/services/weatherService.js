const Result = require('../domain/types/result');
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
        const result = await this.weatherProviderManager.fetchWeather(city);
        // all providers have failed
        if (!result.success)
        {
            return new Result(false, 'NO WEATHER DATA');
        }
        const weather = result.data;
        if (
            typeof weather.temperature !== 'number' ||
            typeof weather.humidity !== 'number' ||
            typeof weather.description !== 'string'
        )
        {
            return new Result(false, 'INVALID WEATHER DATA FORMAT');
        }
        return result;
    }
}

module.exports = WeatherService;
