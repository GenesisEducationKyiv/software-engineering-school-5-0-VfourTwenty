const { expect } = require('chai');
const WeatherProviderManager = require('../../../src/providers/weather-providers/weatherProviderManager');
const { WeatherProviderMock1, WeatherProviderMock2 } = require('../../mocks/providers/weatherProviders.mock');

const mockedWeatherProviders = [new WeatherProviderMock1(), new WeatherProviderMock2()];
const weatherProviderManager = new WeatherProviderManager(mockedWeatherProviders);

// will add logging testing when logging has been implemented

describe('WeatherProviderManager Unit Tests', () => {

    it('should return weather data if the first available provider can fetch it', async () => {
        const data = await weatherProviderManager.fetchWeather('Kyiv');
        expect(data).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should delegate to the next provider and return weather data if the first provider fails to fetch', async () => {
        const data = await weatherProviderManager.fetchWeather('Odesa');
        expect(data).to.deep.equal({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should return null if all available providers fail', async () => {
        const data = await weatherProviderManager.fetchWeather('gfhhhh');
        expect(data).to.be.null;
    });

    it('should return null if provider list is empty', async () => {
        const emptyWeatherProviderManager = new WeatherProviderManager([])
        const data = await emptyWeatherProviderManager.fetchWeather('Kyiv');
        expect(data).to.be.null;
    });
});
