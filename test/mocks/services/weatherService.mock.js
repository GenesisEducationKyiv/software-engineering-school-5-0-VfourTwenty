const Result = require('../../../src/domain/types/result');

class WeatherServiceMock
{
    async fetchWeather(city) {
        if (["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city)) {
            return new Result(true, null, {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
        } else {
            return new Result(false, 'NO WEATHER DATA');
        }
    }
}

module.exports = WeatherServiceMock;