const IWeatherProvider = require('../../../src/providers/weather-providers/weatherProviderInterface');
const Result = require('../../../src/domain/types/result');

class WeatherProviderMock1 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (['Kyiv', 'Lviv'].includes(city)) 
        {
            return new Result(true, null, {
                temperature: 22,
                humidity: 60,
                description: 'Clear sky'
            });
        }
        else
        {
            return new Result(false);
        }
    }
}

class WeatherProviderMock2 extends  IWeatherProvider
{
    async fetchWeather(city)
    {
        if (['Odesa', 'Dnipro'].includes(city)) 
        {
            return new Result(true, null, {
                temperature: 22,
                humidity: 60,
                description: 'Clear sky'
            });
        }
        else
        {
            return new Result(false);
        }
    }
}

module.exports = { WeatherProviderMock1, WeatherProviderMock2 };
