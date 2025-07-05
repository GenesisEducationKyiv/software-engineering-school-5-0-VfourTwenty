const { setUpHourlyEmailCronJob, setUpDailyEmailCronJob} = require('./emailJobs')

function startCronMain()
{
    setUpHourlyEmailCronJob();
    setUpDailyEmailCronJob();
}

module.exports = startCronMain;