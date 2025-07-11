const { buildConfirmEmail, buildUnsubscribeEmail, buildWeatherUpdateEmail } = require('../utils/emailTemplates');

class EmailService 
{
    weatherService;

    subscriptionRepo;

    emailProviderManager;

    constructor(weatherService, subscriptionRepo, emailProviderManager) 
    {
        this.weatherService = weatherService;
        this.subscriptionRepo = subscriptionRepo;
        this.emailProviderManager = emailProviderManager;
    }

    async sendEmail(to, subject, body) 
    {
        return this.emailProviderManager.sendEmail(to, subject, body);
    }

    async sendConfirmationEmail(to, token) 
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const { success, error } = await this.sendEmail(to, subject, body);
        if (!success) 
        {
            console.error('❌ Failed to send confirmation email:', error);
            return false;
        }
        return true;
    }

    async sendUnsubscribeEmail(to, city) 
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribeEmail(city);
        const { success, error } = await this.sendEmail(to, subject, body);
        if (!success) 
        {
            console.error('❌ Failed to send unsubscribe email:', error);
            return false;
        }
        return true;
    }

    async sendWeatherUpdate(email, city, weather, token) 
    {
        const subject = `SkyFetch Weather Update for ${city}`;
        const html = buildWeatherUpdateEmail(city, weather, token);
        const { success, error } = await this.sendEmail(email, subject, html);
        if (!success) 
        {
            console.error(`❌ Failed to send weather update to ${email}:`, error?.message || error);
            return false;
        }
        console.log(`📧 Weather update sent to ${email}`);
        return true;
    }

    async sendUpdates(frequency) 
    {
        const subs = await this.subscriptionRepo.findAllSubs({ confirmed: true, frequency });
        let sent = 0;
        let failed = 0;
        let skipped = 0;
        for (const sub of subs) 
        {
            try 
            {
                const weather = await this.weatherService.fetchWeather(sub.city);
                if (!weather) 
                {
                    console.warn(`⚠️ No weather data available for ${sub.city}, skipping ${sub.email}`);
                    skipped++;
                    continue;
                }
                const ok = await this.sendWeatherUpdate(sub.email, sub.city, weather, sub.token);
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

module.exports = EmailService;
