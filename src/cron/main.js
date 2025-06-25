const { setUpHourlyWeatherCronJob, setUpDailyWeatherCronJob } = require('./weatherJobs');
const { setUpHourlyEmailCronJob, setUpDailyEmailCronJob} = require('./emailJobs')

function cronMain()
{
    setUpHourlyWeatherCronJob();
    setUpHourlyEmailCronJob();

    setUpDailyWeatherCronJob();
    setUpDailyEmailCronJob();
}

module.exports = cronMain;