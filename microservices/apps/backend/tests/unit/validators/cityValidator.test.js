const { expect } = require('chai');
const CityValidator = require('../../../src/application/validators/cityValidator');
const WeatherServiceMock = require('../../mocks/services/weatherService.mock');
const LoggerMock = require('../../mocks/utils/logger.mock');

const loggerMock = new LoggerMock();
const weatherServiceMock = new WeatherServiceMock();
const cityValidator = new CityValidator(weatherServiceMock, loggerMock);

describe('CityValidator Unit Tests', () => 
{
    it('should return true for a valid city', async () => 
    {
        // Act
        const result = await cityValidator.validate('Kyiv');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for an invalid city', async () => 
    {
        // Act
        const result = await cityValidator.validate('hfgshdf');

        // Assert
        expect(result.success).to.be.false;
    });

    it('should return false if city is missing', async () => 
    {
        // Act
        const result = await cityValidator.validate();

        // Assert
        expect(result.success).to.be.false;
    });
});

