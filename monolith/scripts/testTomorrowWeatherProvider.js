const TomorrowWeatherProvider = require('../src/infrastructure/adapters/providers/weather-providers/tomorrowWeatherProvider');
const provider = new TomorrowWeatherProvider();

async function test()
{
    const res = await provider.fetchWeather('');
    console.log(res);
}

test();