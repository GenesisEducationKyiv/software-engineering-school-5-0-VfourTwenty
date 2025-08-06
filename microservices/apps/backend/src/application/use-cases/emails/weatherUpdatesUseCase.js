const { publish } = require('../../../common/queue/publisher');
const events = require('../../../common/queue/events');

class WeatherUpdatesUseCase
{
    constructor(weatherService, subscriptionService)
    {
        this.weatherService = weatherService;
        this.subscriptionService = subscriptionService;
    }

    async sendWeatherUpdates(frequency)
    {
        let published = 0;
        let failed = 0;
        let skipped = 0;

        const findAllResult = await this.subscriptionService.findAllSubs({ confirmed: true, frequency });
        if (!findAllResult)
        {
            console.error('Failed to find subscriptions');
            return { published, failed, skipped };
        }

        const subs = findAllResult.data;

        const cityMap = {};
        for (const sub of subs) {
            if (!cityMap[sub.city]) {
                cityMap[sub.city] = [];
            }
            cityMap[sub.city].push({ email: sub.email, token: sub.token });
        }

        for (const [city, subscribers] of Object.entries(cityMap)) {
            try {
                const response = await this.weatherService.fetchWeather(city);

                if (!response.success) {
                    console.warn(`⚠️ No weather data available for ${city}, skipping, error: ${response.err}`);
                    skipped += subscribers.length;
                    continue;
                }

                const payload = {
                    city,
                    weather: response.data,
                    subscribers
                };

                await publish(events.WEATHER_UPDATES_AVAILABLE, payload);
                published += subscribers.length;
                console.log(`✅ Weather update event published for ${city} (${subscribers.length} subscribers)`);
            }
            catch (err) {
                failed += subscribers.length;
                console.error(`❌ Failed to publish weather update for ${city}:`, err.message);
            }
        }

        return { published, failed, skipped };
    }
}

module.exports = WeatherUpdatesUseCase;