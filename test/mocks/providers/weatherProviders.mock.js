const IWeatherProvider = require('../../../src/providers/weather-providers/weatherProviderInterface');
const WeatherDTO = require('../../../src/domain/types/weather');
const DTO = require('../../../src/domain/types/dto');

class WeatherProviderMock1 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (["Kyiv", "Lviv"].includes(city)) {
            return new WeatherDTO(true, '', {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
        }
        else
        {
            return new DTO(false, '');
        }
    }
}

class WeatherProviderMock2 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (["Odesa", "Dnipro"].includes(city)) {
            return new WeatherDTO(true, '', {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            });
        }
        else
        {
            return new DTO(false, '');
        }
    }
}

module.exports = { WeatherProviderMock1, WeatherProviderMock2 }