const WeatherService = require('../../services/weatherService');

class WeatherJobHandler
{
    async runDaily()
    {
        console.log('Running daily weather fetch job...');
        try
        {
            await WeatherService.fetchDailyWeather();
            console.log('Daily weather fetched');
        }
        catch (err)
        {
            console.error('❌ Daily fetching job failed:', err.message || err);
        }
    }

    async runHourly()
    {
        console.log('Running hourly weather fetch job...');
        try
        {
            await WeatherService.fetchHourlyWeather();
            console.log('Hourly weather fetched');
        }
        catch (err)
        {
            console.error('❌ Hourly job failed:', err.message || err);
        }
    }
}

module.exports = WeatherJobHandler;
