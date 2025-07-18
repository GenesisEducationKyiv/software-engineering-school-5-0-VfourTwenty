const { expect } = require('chai');
const WeatherProviderManager = require('../../../src/providers/weather-providers/weatherProviderManager');
const { WeatherProviderMock1, WeatherProviderMock2 } = require('../../mocks/providers/weatherProviders.mock');

const mockedWeatherProviders = [new WeatherProviderMock1(), new WeatherProviderMock2()];
const weatherProviderManager = new WeatherProviderManager(mockedWeatherProviders);

// will add logging testing when logging has been implemented

describe('WeatherProviderManager Unit Tests', () => {

    it('should return true for success and weather data if the first available provider can fetch it', async () => {
        const result = await weatherProviderManager.fetchWeather('Kyiv');
        expect(result.success).to.be.true;
        expect(result.weather).to.deep.eq({
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
    });

    it('should delegate to the next provider and return weather data if the first provider fails to fetch', async () => {
        const result = await weatherProviderManager.fetchWeather('Odesa');
        console.log(result);
        expect(result.success).to.be.true;
        expect(result.weather).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should return false for success and an error message if all available providers fail', async () => {
        const data = await weatherProviderManager.fetchWeather('gfhhhh');
        expect(data.success).to.be.false;
        expect(data.err).to.eq('all weather providers have failed');
    });
});
