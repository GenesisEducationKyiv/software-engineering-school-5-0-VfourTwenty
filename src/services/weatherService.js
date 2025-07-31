const Result = require('../domain/types/result');
const IWeatherService = require('../domain/interfaces/services/weatherServiceInterface');

class WeatherServiceWithCacheAndMetrics extends IWeatherService
{
    // weatherProvider implements IWeatherProvider
    constructor(
        weatherProvider,
        redisCache,
        cacheHitCounter,
        cacheMissCounter)
    {
        super(weatherProvider);
        this.redisCache = redisCache;
        this.cacheHitCounter = cacheHitCounter;
        this.cacheMissCounter = cacheMissCounter;
    }

    /**
     * @param {string} city
     * @returns {Promise<any>}
     */
    async fetchWeather(city) 
    {
        const cacheKey = `weather:${city.toLowerCase()}`;
        let cachedWeather = null;
        try
        {
            cachedWeather = await this.redisCache.get(cacheKey);
        }
        catch (err)
        {
            console.error('Redis GET error:', err.message);
        }
        if (cachedWeather)
        {
            this.cacheHitCounter.inc();
            return new Result(true, null, JSON.parse(cachedWeather));
        }

        this.cacheMissCounter.inc();
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
            const CACHE_TTL = process.env.CACHE_TTL || 3600;
            await this.redisCache.setEx(cacheKey, CACHE_TTL, JSON.stringify(weather));
        }
        catch (err)
        {
            console.error('Redis SET error:', err.message);
        }
        return result;
    }
}

module.exports = WeatherServiceWithCacheAndMetrics;
