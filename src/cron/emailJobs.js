const cron = require("node-cron");
const {sendUpdates} = require("../utils/mailer");


function startDailyEmailJob() {
    cron.schedule(
        '0 11 * * *',
        async () => {
            console.log('Running daily email job…');
            try {
                const { sent, failed, skipped } = await sendUpdates('daily');
                console.log(`Daily stats ➜ sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
            } catch (err) {
                console.error('❌ Daily email job failed:', err.message || err);
            }
        },
        { timezone: 'Europe/Kyiv' }
    );
}

function startHourlyEmailJob() {
    cron.schedule(
        '0 * * * *',
        async () => {
            console.log('Running hourly email job…');
            try {
                const { sent, failed, skipped } = await sendUpdates('hourly');
                console.log(`Hourly stats ➜ sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
            } catch (err) {
                console.error('❌ Hourly email job failed:', err.message || err);
            }
        },
        { timezone: 'Europe/Kyiv' }
    );
}

module.exports = { startDailyEmailJob, startHourlyEmailJob };