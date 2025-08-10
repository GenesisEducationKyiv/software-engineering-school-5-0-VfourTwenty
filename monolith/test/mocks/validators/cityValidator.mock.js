const Result = require('../../../src/common/utils/result');

class CityValidatorMock
{
    async validate(city)
    {
        const success = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro'].includes(city);
        const errorMessage = success ? null : 'INVALID CITY';
        return new Result(success, errorMessage);
    }
}

module.exports = CityValidatorMock;
