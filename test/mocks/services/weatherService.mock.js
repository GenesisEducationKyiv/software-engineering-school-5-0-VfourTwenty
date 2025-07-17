const WeatherError = require("../../../src/domain/errors/WeatherError");

class WeatherServiceMock
{
    async fetchWeather(city) {
        if (["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city)) {
            return {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            };
        } else {
            throw new WeatherError('NO WEATHER DATA');
        }
    }
}

module.exports = WeatherServiceMock;