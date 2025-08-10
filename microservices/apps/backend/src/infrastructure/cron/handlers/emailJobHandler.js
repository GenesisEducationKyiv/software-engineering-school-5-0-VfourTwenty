class EmailJobHandler
{
    constructor(weatherUpdatesUseCase)
    {
        this.weatherUpdatesUseCase = weatherUpdatesUseCase;
    }

    async runDaily()
    {
        console.log('Running daily email job…');
        try
        {
            const { published, failed, skipped } = await this.weatherUpdatesUseCase.sendWeatherUpdates('daily');
            console.log(`Daily stats ➜ published: ${published}, skipped: ${skipped}, failed: ${failed}`);
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
            const { published, failed, skipped } = await this.weatherUpdatesUseCase.sendWeatherUpdates('hourly');
            console.log(`Hourly stats ➜ published: ${published}, skipped: ${skipped}, failed: ${failed}`);
        }
        catch (err)
        {
            console.error('❌ Hourly email job failed:', err.message || err);
        }
    }
}

module.exports = EmailJobHandler;
