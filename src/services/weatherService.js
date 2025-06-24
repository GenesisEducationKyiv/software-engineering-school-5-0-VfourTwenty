/**
 * @typedef {Object} WeatherProvider
 * @property {function(string): Promise<any>} fetchWeather
 */

const providerState = require('../providers/state.js');

class WeatherService {
    /**
     * The active weather provider (can be swapped for testing or runtime changes)
     * @type {WeatherProvider}
     */
    static provider = providerState.activeWeatherProvider;

    /**
     * Set the active weather provider
     * @param {WeatherProvider} provider
     */
    static setProvider(provider) {
        WeatherService.provider = provider;
    }

    /**
     * Fetch weather using the current provider
     * @param {string} city
     * @returns {Promise<any>}
     */
    static async fetchWeather(city) {
        return WeatherService.provider.fetchWeather(city);
    }
}

module.exports = WeatherService;
