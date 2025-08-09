const { expect } = require('chai');
const request = require('supertest');
const express = require('express');

const WeatherApiController = require('../../src/presentation/controllers/weatherApiController');
const WeatherService = require('../../src/application/services/weatherService');
const GetWeatherUseCase = require('../../src/application/use-cases/weather/getWeatherUseCase');
const MockWeatherProviderManager = require('../mocks/providers/weatherProviderManager.mock');
const { redisClient, connectToRedisWithRetry } = require('../../src/common/cache/redis/redisClient');
const MetricsProviderMock = require('../mocks/metrics/metricsProvider.mock');

connectToRedisWithRetry();
const app = express();
app.use(express.json());

const mockManager = new MockWeatherProviderManager();
const mockMetricsProvider = new MetricsProviderMock();
const weatherService = new WeatherService(mockManager, redisClient, mockMetricsProvider);
const getWeatherUseCase = new GetWeatherUseCase(weatherService);
const weatherApiController = new WeatherApiController(getWeatherUseCase);

app.get('/api/weather', weatherApiController.getWeather);

describe('GET /api/weather', () => 
{
    it('should return 400 if no city is provided', async () => 
    {
        const res = await request(app).get('/api/weather');
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('City is a required field');
    });

    it('should return weather data for a valid city', async () => 
    {
        const res = await request(app).get('/api/weather?city=Kyiv');
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('temperature', 'humidity', 'description');
        expect(res.body.temperature).to.equal(22);
        expect(res.body.humidity).to.equal(60);
        expect(res.body.description).to.equal('Clear sky');
    });

    it('should return 404 for invalid city', async () => 
    {
        const res = await request(app).get('/api/weather?city=INVALIDCITYNAME123');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('No weather data available for this location');
    });
});
