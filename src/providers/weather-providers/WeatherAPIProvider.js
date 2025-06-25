const IWeatherProvider = require( "./weatherProviderBase" );
require('dotenv').config()
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class WeatherAPIProvider extends IWeatherProvider
{
    get name() {
        return "WeatherAPI.com";
    }

    async fetchWeather(city)
    {
        console.log("weather api fetch weather called");
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        return {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text
        };
    }
}

module.exports = WeatherAPIProvider;