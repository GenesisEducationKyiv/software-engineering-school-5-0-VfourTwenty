const VisualCrossingWeatherProvider = require('../src/infrastructure/adapters/providers/weather-providers/visualCrossingWeatherProvider');
const provider = new VisualCrossingWeatherProvider();

async function test()
{
    const res = await provider.fetchWeather('Paris');
    console.log(res);
}

test();