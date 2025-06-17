const cron = require("node-cron");
const {sendUpdates} = require("../utils/mailer");

function startDailyEmailJob()
{
    cron.schedule('0 11 * * *', async () => {
        console.log('Running daily email job...');
        try {
            await sendUpdates('daily');
        } catch (err) {
            console.error('❌ Daily email job failed:', err.message || err);
        }
    });
}

function startHourlyEmailJob()
{
    cron.schedule('0 * * * *', async () => {
        console.log('Running hourly email job...');
        try {
            await sendUpdates('hourly');
        } catch (err) {
            console.error('❌ Hourly email job failed:', err.message || err);
        }
    });
}

module.exports = { startDailyEmailJob, startHourlyEmailJob };