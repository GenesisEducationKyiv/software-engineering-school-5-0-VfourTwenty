const IWeatherProvider = require('../../../../domain/interfaces/providers/weatherProviderInterface');
const config = require('../../../../common/config').weatherProviders;
const WEATHER_API_KEY = config.weatherApiKey;

const Result = require('../../../../domain/types/result');

class WeatherApiProvider extends IWeatherProvider
{
    get name() 
    {
        return 'WeatherAPI.com';
    }

    async fetchWeather(city)
    {
        console.log('weather api fetch weather called');
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error)
        {
            console.error('Weather API error:', data.error.message);
            return new Result(false, 'no data', null);
        }

        return new Result(true, null, {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text
        });
    }
}

module.exports = WeatherApiProvider;
