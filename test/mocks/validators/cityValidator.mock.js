const WeatherError = require("../../../src/domain/errors/WeatherError");

class CityValidatorMock
{
    async validate(city)
    {
        return ["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city);
    }
}

module.exports = CityValidatorMock;