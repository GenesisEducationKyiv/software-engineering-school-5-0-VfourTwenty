const {expect} = require("chai");
const WeatherService = require('../../../src/services/weatherService');
const WeatherError = require('../../../src/errors/WeatherError');
const MockWeatherProviderManager = require('../../mocks/weatherProviderManager.mock');

const mockWeatherProviderManager = new MockWeatherProviderManager();
const weatherService = new WeatherService(mockWeatherProviderManager);

describe('WeatherService Unit Tests', () => {

    it('should return weather data for a valid city', async () => {
        const data = await weatherService.fetchWeather('Kyiv');
        expect(data).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should throw a WeatherError(NO WEATHER DATA) for invalid city', async() => {
        try {
            await weatherService.fetchWeather('InvalidCity');
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(WeatherError);
            expect(error.message).to.equal('NO WEATHER DATA');
        }
    })
});
