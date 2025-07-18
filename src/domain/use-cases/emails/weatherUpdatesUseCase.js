const { buildWeatherUpdateEmail } = require('../../../utils/emailTemplates');
const EmailError = require('../../errors/EmailError');
const DTO = require('../../types/dto');

class WeatherUpdatesUseCase
{
    // depends on a service interface
    constructor(emailService, weatherService, subscriptionRepo)
    {
        this.emailService = emailService;
        this.weatherService = weatherService;
        this.subscriptionRepo = subscriptionRepo;
    }

    // internal helper
    async sendWeatherUpdate(email, city, weather, token)
    {
        const subject = `SkyFetch Weather Update for ${city}`;
        const html = buildWeatherUpdateEmail(city, weather, token);
        const result = await this.emailService.sendEmail(email, subject, html);
        if (!result.success)
        {
            return false;
        }
        console.log(`📧 Weather update sent to ${email}`);
        return true;
    }

    async sendWeatherUpdates(frequency)
    {
        const subs = await this.subscriptionRepo.findAllSubs({ confirmed: true, frequency });
        let sent = 0;
        let failed = 0;
        let skipped = 0;
        for (const sub of subs)
        {
            try
            {
                const response = await this.weatherService.fetchWeather(sub.city);
                console.log('data in weather updates use case: ', response);
                if (!response.success)
                {
                    console.warn(`⚠️ No weather data available for ${sub.city}, skipping ${sub.email}, error: ${response.err}`);
                    skipped++;
                    continue;
                }
                const ok = await this.sendWeatherUpdate(sub.email, sub.city, response.weather, sub.token);
                if (ok)
                {
                    sent++;
                    console.log(`✅ ${frequency} email sent to ${sub.email}`);
                }
                else
                {
                    failed++;
                    console.error(`❌ Email send failed for ${sub.email}`);
                }
            }
            catch (err)
            {
                failed++;
                console.error(`❌ Failed ${frequency} for ${sub.email}:`, err.message);
            }
        }
        return { sent, failed, skipped };
    }
}

module.exports = WeatherUpdatesUseCase;
