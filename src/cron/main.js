class CronMain
{
    constructor(emailJobs)
    {
        this.emailJobs = emailJobs;
    }

    start()
    {
        this.emailJobs.setUpHourlyEmailCronJob();
        this.emailJobs.setUpDailyEmailCronJob();
    }
}

module.exports = CronMain;