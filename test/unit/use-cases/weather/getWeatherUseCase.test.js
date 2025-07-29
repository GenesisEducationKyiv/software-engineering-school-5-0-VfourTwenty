const GetWeatherUseCase = require('../../../../src/use-cases/weather/getWeatherUseCase');
const WeatherServiceMock = require('../../../mocks/services/weatherService.mock');
const {expect} = require("chai");

const weatherServiceMock = new WeatherServiceMock();
const getWeatherUseCase = new GetWeatherUseCase(weatherServiceMock);

describe('GetWeatherUseCase Unit Tests', () => {

    it('should return true for success and weather data if weather service succeeds', async () => {
        const result = await getWeatherUseCase.getWeather('Kyiv');
        expect(result.success).to.be.true;
        expect(result.data).to.deep.eq({
            temperature: 22,
            humidity: 60,
            description: "Clear sky"
        });
    });

    it('should return false for success and an error message if weather service fails', async () => {
        const result = await getWeatherUseCase.getWeather('NotRealCity');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('NO WEATHER DATA');
    });
});