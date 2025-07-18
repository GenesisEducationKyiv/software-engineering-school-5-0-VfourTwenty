const cron = require('node-cron');

class EmailJobs 
{
    constructor(emailJobHandler)
    {
        this.handler = emailJobHandler;
    }

    setUpDailyEmailCronJob() 
    {
        cron.schedule('0 11 * * *', () => this.handler.runDaily(), { timezone: 'Europe/Kyiv' });
    }

    setUpHourlyEmailCronJob() 
    {
        cron.schedule('5 * * * *', () => this.handler.runHourly(), { timezone: 'Europe/Kyiv' });
    }
}

module.exports = EmailJobs;
