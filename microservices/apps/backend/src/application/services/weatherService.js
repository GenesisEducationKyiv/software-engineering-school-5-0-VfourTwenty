const Result = require('../../domain/types/result');
const IWeatherService = require('../../domain/interfaces/weatherServiceInterface');
const config = require('../../common/config');

class WeatherService extends IWeatherService
{
    async fetchWeather(city)
    {
        const weatherRes = await fetch(`${config.weatherUrl}/weather-current?city=${encodeURIComponent(city)}`);

        if (weatherRes.status !== 200) return new Result(false, 'NO WEATHER DATA');

        const weatherJson = await weatherRes.json();

        return new Result(true, null, weatherJson);
    }
}

module.exports = WeatherService;