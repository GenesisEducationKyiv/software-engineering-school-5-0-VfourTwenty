const DTO = require('../../../src/domain/types/dto');
const WeatherDTO = require('../../../src/domain/types/weather');

class WeatherServiceMock
{
    async fetchWeather(city) {
        if (["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city)) {
            return new WeatherDTO(true, '', {
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