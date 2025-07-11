const cron = require("node-cron");
const EmailJobHandler = require('./handlers/emailJobHandler');

class EmailJobs {
    constructor(emailService)
    {
        this.handler = new EmailJobHandler(emailService);
    }

    setUpDailyEmailCronJob() {
        cron.schedule('0 11 * * *', () => this.handler.runDaily(), { timezone: 'Europe/Kyiv' });
    }

    setUpHourlyEmailCronJob() {
        cron.schedule('20 * * * *', () => this.handler.runHourly(), { timezone: 'Europe/Kyiv' });
    }
}

module.exports = EmailJobs;