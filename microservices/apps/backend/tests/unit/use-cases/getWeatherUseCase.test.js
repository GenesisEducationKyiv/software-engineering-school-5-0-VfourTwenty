const GetWeatherUseCase = require('../../../src/application/use-cases/getWeatherUseCase');
const WeatherServiceMock = require('../../mocks/services/weatherService.mock');
const LoggerMock = require('../../mocks/utils/logger.mock');
const { expect } = require('chai');

const weatherServiceMock = new WeatherServiceMock();
const loggerMock = new LoggerMock();
const getWeatherUseCase = new GetWeatherUseCase(weatherServiceMock, loggerMock);

describe('GetWeatherUseCase Unit Tests', () => 
{
    it('should return true for success and weather data for a valid city', async () => 
    {
        // Act
        const result = await getWeatherUseCase.getWeather('Kyiv');

        // Assert
        expect(result.success).to.be.true;
        expect(result.data).to.deep.eq({
            temperature: 22,
            humidity: 60,
            description: 'Clear sky'
        });
    });

    it('should return false for success and an error message for an invalid city', async () => 
    {
        // Act
        const result = await getWeatherUseCase.getWeather('NotRealCity');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('NO WEATHER DATA');
    });
});
