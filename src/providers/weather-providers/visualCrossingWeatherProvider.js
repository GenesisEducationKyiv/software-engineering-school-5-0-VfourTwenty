const IWeatherProvider = require('./weatherProviderInterface');
const config = require('../../config/index');
const VISUAL_CROSSING_API_KEY = config.visualCrossingApiKey;

const Result = require('../../domain/types/result');

class VisualCrossingWeatherProvider extends IWeatherProvider
{
    get name()
    {
        return 'Visual Crossing';
    }

    async fetchWeather(city)
    {
        console.log('visual crossing fetch weather called');
        const currentTime = new Date().toISOString();
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${currentTime}?key=${VISUAL_CROSSING_API_KEY}`;
        try
        {
            const res = await fetch(url);
            const data = await res.json();
            const currentData = data.currentConditions;

            return new Result(true, null, {
                temperature: currentData.temp,
                humidity: currentData.humidity,
                description: currentData.conditions
            });
        }
        catch (err)
        {
            console.log(err.message);
            return new Result(false, 'no data', null);
        }
    }
}

module.exports = VisualCrossingWeatherProvider;
