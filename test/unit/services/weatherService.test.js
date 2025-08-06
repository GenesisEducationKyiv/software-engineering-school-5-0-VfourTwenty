const { expect } = require('chai');
const WeatherService = require('../../../src/services/weatherService');
const MockWeatherProviderManager = require('../../mocks/providers/weatherProviderManager.mock');
const RedisClientMock = require('../../mocks/cache/redisClient.mock');
const MetricsProviderMock = require('../../mocks/metrics/metricsProvider.mock');

const metricsProviderMock = new MetricsProviderMock();
const mockWeatherProviderManager = new MockWeatherProviderManager();
const redisClientMock = new RedisClientMock();
const weatherService = new WeatherService(mockWeatherProviderManager, redisClientMock, metricsProviderMock);

const expectedWeatherData = {
    temperature: 22,
    humidity: 60,
    description: 'Clear sky'
};

describe('WeatherService Unit Tests', () =>
{
    beforeEach(async () =>
    {
        metricsProviderMock.reset();
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
        console.log('metrics: ', metricsProviderMock.metrics);
        expect(metricsProviderMock.metrics['weatherCacheHits']).to.eq(0);
        expect(metricsProviderMock.metrics['weatherCacheMisses']).to.eq(1);
    });

    it('should return true for success and weather data for a valid city from cache if it is present and increment cache hit counter', async () =>
    {
        // Arrange
        await redisClientMock.set('weather:kyiv', JSON.stringify(expectedWeatherData));

        // Act
        const data = await weatherService.fetchWeather('Kyiv');

        // Assert
        expect(data.success).to.be.true;
        expect(data.data).to.deep.equal(expectedWeatherData);
        expect(metricsProviderMock.metrics['weatherCacheHits']).to.eq(1);
        expect(metricsProviderMock.metrics['weatherCacheMisses']).to.eq(0);
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
