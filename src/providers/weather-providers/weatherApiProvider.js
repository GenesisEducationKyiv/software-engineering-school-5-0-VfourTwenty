const IWeatherProvider = require('./weatherProviderInterface');
const config = require('../../config/index');
const WEATHER_API_KEY = config.weatherApiKey;

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
            return null;
        }
        return {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text
        };
    }
}

module.exports = WeatherApiProvider;
