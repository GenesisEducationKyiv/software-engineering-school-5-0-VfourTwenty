const { expect } = require('chai');
const WeatherProviderManager = require('../../../src/providers/weather-providers/weatherProviderManager');
const { WeatherProviderMock1, WeatherProviderMock2 } = require('../../mocks/providers/weatherProviders.mock');

const mockedWeatherProviders = [new WeatherProviderMock1(), new WeatherProviderMock2()];
const weatherProviderManager = new WeatherProviderManager(mockedWeatherProviders);

describe('WeatherProviderManager Unit Tests', () => {

    it('should return true for success and weather data if the first available provider can fetch it', async () => {
        // Act
        const result = await weatherProviderManager.fetchWeather('Kyiv');

        // Assert
        expect(result.success).to.be.true;
        expect(result.data).to.deep.eq({
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
    });

    it('should delegate to the next provider and return weather data if the first provider fails to fetch', async () => {
        // Act
        const result = await weatherProviderManager.fetchWeather('Odesa');

        // Assert
        expect(result.success).to.be.true;
        expect(result.data).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should return false for success and an error message if all available providers fail', async () => {
        // Act
        const data = await weatherProviderManager.fetchWeather('gfhhhh');

        // Assert
        expect(data.success).to.be.false;
        expect(data.err).to.eq('all weather providers have failed');
    });
});
