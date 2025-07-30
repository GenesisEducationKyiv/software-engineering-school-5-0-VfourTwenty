const {expect} = require("chai");
const WeatherService = require('../../../src/services/weatherService');
const MockWeatherProviderManager = require('../../mocks/providers/weatherProviderManager.mock');

const mockWeatherProviderManager = new MockWeatherProviderManager();
const weatherService = new WeatherService(mockWeatherProviderManager);

describe('WeatherService Unit Tests', () => {

    it('should return true for success and weather data for a valid city', async () => {
        // Act
        const data = await weatherService.fetchWeather('Kyiv');

        // Assert
        expect(data.success).to.be.true;
        expect(data.data).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should return false for success and and error message for invalid city', async() => {
        // Act
        const data = await weatherService.fetchWeather('InvalidCity');

        // Assert
        expect(data.success).to.be.false;
        expect(data.err).to.eq('NO WEATHER DATA');
    })

    it('should return false for success and and error message if city is missing', async() => {
        // Act
        const data = await weatherService.fetchWeather();

        // Assert
        expect(data.success).to.be.false;
        expect(data.err).to.eq('NO WEATHER DATA');
    })
});
