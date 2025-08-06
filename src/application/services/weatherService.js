const Result = require('../../domain/types/result');
const IWeatherService = require('../../domain/interfaces/services/weatherServiceInterface');
const METRICS_KEYS = require('../../common/metrics/metricsKeys');
const { normalizeString } = require('../../common/utils/strings');

class WeatherService extends IWeatherService
{
    // weatherProvider implements IWeatherProvider
    constructor(
        weatherProvider,
        cacheProvider,
        metricsProvider)
    {
        super(weatherProvider);
        this.cacheProvider = cacheProvider;
        this.metricsProvider = metricsProvider;
    }

    /**
     * @param {string} city
     * @returns {Promise<any>}
     */
    async fetchWeather(city)
    {
        if (!city)
        {
            return new Result(false, 'NO WEATHER DATA');
        }
        const cacheKey = `weather:${normalizeString(city)}`;
        let cachedWeather = null;
        try
        {
            cachedWeather = await this.cacheProvider.get(cacheKey);
        }
        catch (err)
        {
            console.error('Redis GET error:', err.message);
        }
        if (cachedWeather)
        {
            this.metricsProvider.incrementCounter(METRICS_KEYS.WEATHER_CACHE_HITS);
            return new Result(true, null, JSON.parse(cachedWeather));
        }

        this.metricsProvider.incrementCounter(METRICS_KEYS.WEATHER_CACHE_MISSES);
        const result = await this.weatherProvider.fetchWeather(city);

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
        try
        {
            await this.cacheProvider.set(cacheKey, JSON.stringify(weather));
        }
        catch (err)
        {
            console.error('Redis SET error:', err.message);
        }
        return result;
    }
}

module.exports = WeatherService;
