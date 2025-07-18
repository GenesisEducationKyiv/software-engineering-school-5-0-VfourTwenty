const WeatherError = require("../../../src/domain/errors/WeatherError");
const DTO = require('../../../src/domain/types/dto');

class WeatherServiceMock
{
    async fetchWeather(city) {
        if (["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city)) {
            return new DTO(true, '', {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
        } else {
            return new DTO(false, 'NO WEATHER DATA');
        }
    }
}

module.exports = WeatherServiceMock;