const { startDailyWeatherJob, startHourlyWeatherJob } = require('./weatherJobs');
const { startDailyEmailJob, startHourlyEmailJob} = require('./emailJobs')

function cronMain()
{
    startHourlyWeatherJob();
    startHourlyEmailJob();

    startDailyWeatherJob();
    startDailyEmailJob();
}

module.exports = cronMain;