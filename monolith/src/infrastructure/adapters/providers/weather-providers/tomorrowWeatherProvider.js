const IWeatherProvider = require('../../../../domain/interfaces/providers/weatherProviderInterface');
const config = require('../../../../common/config').weatherProviders;
const TOMORROW_IO_API_KEY = config.tomorrowIoApiKey;

const Result = require('../../../../domain/types/result');

const WeatherCodes = {
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2100: 'Light Fog',
    2000: 'Fog',
    4000: 'Drizzle',
    4200: 'Light Rain',
    4001: 'Rain',
    4201: 'Heavy Rain',
    5001: 'Flurries',
    5100: 'Light Snow',
    5000: 'Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6200: 'Light Freezing Drizzle',
    6001: 'Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
};

class TomorrowWeatherProvider extends IWeatherProvider
{
    get name()
    {
        return 'Tomorrow.io';
    }

    async fetchWeather(city)
    {
        console.log('tomorrow io fetch weather called');
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${TOMORROW_IO_API_KEY}`;
        try
        {
            const res = await fetch(url);
            const data = await res.json();

            // provider specific failure response
            if (data?.code === 400001 && data?.type === 'Invalid Query Parameters')
            {
                return new Result(false, 'invalid location', null);
            }

            const currentData = data.timelines.hourly[0].values;
            const description = WeatherCodes[currentData.weatherCode];
            if (!description)
            {
                console.log('unknown weather code in tomorrow provider');
                return new Result(false, 'unknown weather code', null);
            }
            return new Result(true, null, {
                temperature: currentData.temperature,
                humidity: currentData.humidity,
                description: description
            });
        }

        // eslint-disable-next-line no-unused-vars
        catch (err)
        {
            return new Result(false, 'no data', null);
        }
    }
}

module.exports = TomorrowWeatherProvider;
