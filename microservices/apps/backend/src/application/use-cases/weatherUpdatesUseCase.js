const events = require('../../common/queue/events');
const metricsKeys = require('../../common/metrics/metricsKeys');

class WeatherUpdatesUseCase
{
    constructor(
        weatherService,
        subscriptionService,
        queuePublisher,
        logger,
        metricsProvider
    )
    {
        this.weatherService = weatherService;
        this.subscriptionService = subscriptionService;
        this.queuePublisher = queuePublisher;
        this.log = logger.for('WeatherUpdatesUseCase');
        this.metricsProvider = metricsProvider;
    }

    async sendWeatherUpdates(frequency)
    {
        let published = 0;
        let failed = 0;
        let skipped = 0;

        const findAllResult = await this.subscriptionService.findAllSubs({ confirmed: true, frequency });
        if (!findAllResult)
        {
            this.log.error(`Failed to find subscriptions for ${frequency} frequency`);
            return { published, failed, skipped };
        }

        const subs = findAllResult.data;

        const cityMap = {};
        for (const sub of subs) 
        {
            if (!cityMap[sub.city]) 
            {
                cityMap[sub.city] = [];
            }
            cityMap[sub.city].push({ email: sub.email, token: sub.token });
        }

        for (const [city, subscribers] of Object.entries(cityMap)) 
        {
            try 
            {
                const response = await this.weatherService.fetchWeather(city);

                if (!response.success) 
                {
                    this.log.warn(`⚠️ No weather data available for ${city}, skipping, error: ${response.err}`);
                    skipped += subscribers.length;
                    continue;
                }

                const payload = {
                    city,
                    weather: response.data,
                    subscribers
                };

                this.queuePublisher.publish(events.WEATHER_UPDATES_AVAILABLE, payload);
                this.metricsProvider.incrementCounter(metricsKeys.QUEUE_JOBS_PUBLISHED, 1,
                    { event: events.WEATHER_UPDATES_AVAILABLE }
                );
                published += subscribers.length;
                this.log.info(`✅ Weather update event published for ${city} (${subscribers.length} subscribers)`);
            }
            catch (err) 
            {
                failed += subscribers.length;
                this.log.error(`❌ Failed to publish weather update for ${city}:`, err.message);
            }
        }

        this.log.info('Published, failed, skipped weather updates', { published, failed, skipped });
        return { published, failed, skipped };
    }
}

module.exports = WeatherUpdatesUseCase;
