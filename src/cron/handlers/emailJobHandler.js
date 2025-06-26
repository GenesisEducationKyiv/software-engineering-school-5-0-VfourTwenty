const EmailService = require('../../services/emailService');

class EmailJobHandler
{
    async runDaily()
    {
        console.log('Running daily email job…');
        try
        {
            const { sent, failed, skipped } = await EmailService.sendUpdates('daily');
            console.log(`Daily stats ➜ sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            console.error('❌ Daily email job failed:', err.message || err);
        }
    }

    async runHourly()
    {
        console.log('Running hourly email job…');
        try
        {
            const { sent, failed, skipped } = await EmailService.sendUpdates('hourly');
            console.log(`Hourly stats ➜ sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            console.error('❌ Hourly email job failed:', err.message || err);
        }
    }
}

module.exports = EmailJobHandler;
