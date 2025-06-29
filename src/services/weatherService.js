const weatherProviders = require('../providers/weather-providers/weatherProvidersAll');
const WeatherCityRepo = require("../repositories/weatherCityRepo");
const WeatherDataRepo = require("../repositories/weatherDataRepo");
// need to abstract from sequelize operators
const {Op} = require("sequelize");
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

    static async fetchHourlyWeather() {
        const cities = await WeatherCityRepo.findAllBy({ hourly_count: { [Op.gt]: 0 } });

        console.log(`Fetching hourly weather for ${cities.length} cities...`);

        for (const { city } of cities) {
            try {
                console.log("fetching weather for ", city);
                const data = await WeatherService.fetchWeather(city);
                await WeatherDataRepo.upsert({
                    city,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    description: data.description,
                    fetchedAt: new Date()
                });
                console.log(`✅ Cached hourly weather for ${city}`);
            } catch (err) {
                console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
            }
        }
    }

    static async fetchDailyWeather() {
        const cities = await WeatherCityRepo.findAllBy({daily_count: {[Op.gt]: 0}, hourly_count: 0});

        console.log(`Fetching daily-only weather for ${cities.length} cities...`);

        for (const {city} of cities) {
            try {
                const data = await WeatherService.fetchWeather(city);
                await WeatherDataRepo.upsert({
                    city,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    description: data.description,
                    fetchedAt: new Date()
                });
                console.log(`✅ Cached daily-only weather for ${city}`);
            } catch (err) {
                console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
            }
        }
    }
}

module.exports = WeatherService;