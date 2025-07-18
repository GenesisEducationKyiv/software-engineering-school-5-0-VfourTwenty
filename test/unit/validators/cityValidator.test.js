const CityValidator = require('../../../src/domain/validators/cityValidator');
const GetWeatherUseCaseMock = require('../../mocks/use-cases/getWeatherUseCase.mock');
const {expect} = require("chai");

const getWeatherUseCaseMock = new GetWeatherUseCaseMock();
const cityValidator = new CityValidator(getWeatherUseCaseMock);

describe('CityValidator Unit Tests', () => {

    it('should return true for a valid city', async () => {
        const result = await cityValidator.validate('Kyiv');
        expect(result).to.be.true;
    });

    it('should return false for an invalid city', async () => {
        const result = await cityValidator.validate('hfgshdf');
        expect(result).to.be.false;
    });
});

