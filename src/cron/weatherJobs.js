const cron = require("node-cron");
const WeatherService = require('../services/weatherService');

function setUpDailyWeatherCronJob() {
    cron.schedule('59 10 * * *', async () => {
        console.log('Running daily weather fetch job...');
        try {
            await WeatherService.fetchDailyWeather();
            console.log('Daily weather fetched');
        } catch (err) {
            console.error('❌ Daily fetching job failed:', err.message || err);
        }
    });
}

function setUpHourlyWeatherCronJob() {
    cron.schedule('59 * * * *', async () => {
        console.log('Running hourly weather fetch job...');
        try {
            await WeatherService.fetchHourlyWeather();
            console.log("hourly weather fetched");
        } catch (err) {
            console.error('❌ Hourly job failed:', err.message || err);
        }
    });
}



module.exports = { setUpDailyWeatherCronJob, setUpHourlyWeatherCronJob };