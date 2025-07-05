class EmailJobHandler
{
    emailService;

    constructor(emailService)
    {
        this.emailService = emailService;
    }

    async runDaily()
    {
        console.log('Running daily email job…');
        try
        {
            const { sent, failed, skipped } = await this.emailService.sendUpdates('daily');
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
            const { sent, failed, skipped } = await this.emailService.sendUpdates('hourly');
            console.log(`Hourly stats ➜ sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            console.error('❌ Hourly email job failed:', err.message || err);
        }
    }
}

module.exports = EmailJobHandler;
