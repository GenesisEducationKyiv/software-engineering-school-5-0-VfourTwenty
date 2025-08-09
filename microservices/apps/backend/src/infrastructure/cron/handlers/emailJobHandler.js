class EmailJobHandler
{
    constructor(weatherUpdatesUseCase, logger)
    {
        this.weatherUpdatesUseCase = weatherUpdatesUseCase;
        this.log = logger.for('EmailCronJobHandler');
    }

    async runDaily()
    {
        this.log.info('Running daily email job...');
        try
        {
            const { published, failed, skipped } = await this.weatherUpdatesUseCase.sendWeatherUpdates('daily');
            this.log.info(`Daily stats ➜ published: ${published}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            this.log.error('❌ Daily email job failed:', err.message || err);
        }
    }

    async runHourly()
    {
        this.log.info('Running hourly email job...');
        try
        {
            const { published, failed, skipped } = await this.weatherUpdatesUseCase.sendWeatherUpdates('hourly');
            this.log.info(`Hourly stats ➜ published: ${published}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            this.log.error('❌ Hourly email job failed:', err.message || err);
        }
    }
}

module.exports = EmailJobHandler;
