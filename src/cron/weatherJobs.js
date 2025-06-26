const cron = require("node-cron");
const WeatherJobHandler = require('./handlers/weatherJobHandler');

const handler = new WeatherJobHandler();

function setUpDailyWeatherCronJob()
{
    cron.schedule('59 10 * * *', () => handler.runDaily());
}

function setUpHourlyWeatherCronJob()
{
    cron.schedule('59 * * * *', () => handler.runHourly());
}

module.exports = { setUpDailyWeatherCronJob, setUpHourlyWeatherCronJob };