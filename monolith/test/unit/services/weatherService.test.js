const { expect } = require('chai');
const WeatherServiceWithCacheAndMetrics = require('../../../src/services/weatherService');
const MockWeatherProviderManager = require('../../mocks/providers/weatherProviderManager.mock');
const RedisClientMock = require('../../mocks/utils/redisClient.mock');
const SimpleCounter = require('../../mocks/utils/metrics.mock');

const mockWeatherProviderManager = new MockWeatherProviderManager();
const redisClientMock = new RedisClientMock();
const weatherService = new WeatherServiceWithCacheAndMetrics(
    mockWeatherProviderManager, redisClientMock, null, null); // create counters in setup

const expectedWeatherData = {
    temperature: 22,
    humidity: 60,
    description: 'Clear sky'
};

describe('WeatherService Unit Tests', () =>
{
    beforeEach(async () =>
    {
        weatherService.cacheHitCounter = new SimpleCounter();
        weatherService.cacheMissCounter = new SimpleCounter();
    });

    it('should return true for success and weather data for a valid city saving the data to cache and incrementing cache miss counter', async () =>
    {
        // Act
        const data = await weatherService.fetchWeather('Kyiv');
        const cachedData = await redisClientMock.get('weather:kyiv');

        // Assert
        expect(data.success).to.be.true;
        expect(data.data).to.deep.equal(expectedWeatherData);
        expect(cachedData).to.eq(JSON.stringify(expectedWeatherData));
        expect(weatherService.cacheHitCounter.value).to.eq(0);
        expect(weatherService.cacheMissCounter.value).to.eq(1);
    });

    it('should return true for success and weather data for a valid city from cache if it is present and increment cache hit counter', async () =>
    {
        // Arrange
        await redisClientMock.setEx('weather:kyiv', 100, JSON.stringify(expectedWeatherData));

        // Act
        const data = await weatherService.fetchWeather('Kyiv');

        // Assert
        expect(data.success).to.be.true;
        expect(data.data).to.deep.equal(expectedWeatherData);
        expect(weatherService.cacheHitCounter.value).to.eq(1);
        expect(weatherService.cacheMissCounter.value).to.eq(0);
    });

    it('should return false for success and and error message for invalid city', async() => 
    {
        // Act
        const data = await weatherService.fetchWeather('InvalidCity');

        // Assert
        expect(data.success).to.be.false;
        expect(data.err).to.eq('NO WEATHER DATA');
    });

    it('should return false for success and and error message if city is missing', async() => 
    {
        // Act
        const data = await weatherService.fetchWeather();

        // Assert
        expect(data.success).to.be.false;
        expect(data.err).to.eq('NO WEATHER DATA');
    });
});
