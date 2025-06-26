const { setUpHourlyWeatherCronJob, setUpDailyWeatherCronJob } = require('./weatherJobs');
const { setUpHourlyEmailCronJob, setUpDailyEmailCronJob} = require('./emailJobs')

function startCronMain()
{
    setUpHourlyWeatherCronJob();
    setUpHourlyEmailCronJob();

    setUpDailyWeatherCronJob();
    setUpDailyEmailCronJob();
}

module.exports = startCronMain;