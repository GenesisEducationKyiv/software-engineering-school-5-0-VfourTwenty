const WeatherDTO = require("../../../src/domain/types/weather");
const DTO = require("../../../src/domain/types/dto");

class GetWeatherUseCaseMock
{
    async getWeather(city)
    {
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

module.exports = GetWeatherUseCaseMock;