const cron = require("node-cron");
const EmailJobHandler = require('./handlers/emailJobHandler');

const handler = new EmailJobHandler();

function setUpDailyEmailCronJob()
{
    cron.schedule('0 11 * * *', () => handler.runDaily(), { timezone: 'Europe/Kyiv' });
}

function setUpHourlyEmailCronJob()
{
    cron.schedule('25 * * * *', () => handler.runHourly(), { timezone: 'Europe/Kyiv' });
}

module.exports = { setUpDailyEmailCronJob, setUpHourlyEmailCronJob };