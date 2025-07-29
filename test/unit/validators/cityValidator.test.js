const CityValidator = require('../../../src/domain/validators/cityValidator');
const WeatherServiceMock = require('../../mocks/services/weatherService.mock');
const {expect} = require("chai");

const weatherServiceMock = new WeatherServiceMock();
const cityValidator = new CityValidator(weatherServiceMock);

describe('CityValidator Unit Tests', () => {

    it('should return true for a valid city', async () => {
        const result = await cityValidator.validate('Kyiv');
        expect(result).to.be.true;
    });

    it('should return false for an invalid city', async () => {
        const result = await cityValidator.validate('hfgshdf');
        expect(result).to.be.false;
    });

    it('should return false if city is missing', async () => {
        const result = await cityValidator.validate();
        expect(result).to.be.false;
    });
});

