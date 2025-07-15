const IWeatherProvider = require('../../../src/providers/weather-providers/weatherProviderInterface');

class WeatherProviderMock1 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (["Kyiv", "Lviv"].includes(city)) {
            return {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            };
        }
        else
        {
            return null;
        }
    }
}

class WeatherProviderMock2 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (["Odesa", "Dnipro"].includes(city)) {
            return {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            };
        }
        else
        {
            return null;
        }
    }
}

module.exports = { WeatherProviderMock1, WeatherProviderMock2 }