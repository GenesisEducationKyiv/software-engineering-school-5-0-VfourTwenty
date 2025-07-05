// mock this array for tests
const emailProviders = require('../providers/email-providers/emailProvidersAll');
const { buildConfirmEmail, buildUnsubscribeEmail, buildWeatherUpdateEmail } = require('../utils/emailTemplates');
const { logProviderResponse } = require('../utils/logger');

/**
 * @typedef {Object} EmailProvider
 * @property {function(string, string, string): Promise<any>} sendEmail
 * @property {string} name
 */

class EmailService {
    /**
     * Try each provider in order until one succeeds.
     * @param {string} to
     * @param {string} subject
     * @param {string} body
     * @returns {Promise<any>}
     */

    // logPath = require('path').join(__dirname, '../../logs/emailProvider.log');
    // loggingEnabled = true;

    weatherService;
    subscriptionRepo;

    constructor(weatherService, subscriptionRepo)
    {
        this.weatherService = weatherService;
        this.subscriptionRepo = subscriptionRepo;
    }

    // turn of logs for tests
    // setLoggingEnabled(enabled) {
    //     this.loggingEnabled = enabled;
    // }


    // call same function on provider manager for selecting provider
    async sendEmail(to, subject, body, provider = null) {
        if (provider != null)
        {
            return await provider.sendEmail(to, subject, body);
        }
        for (const provider of emailProviders) {
            try {
                const result = await provider.sendEmail(to, subject, body);
            //    logProviderResponse(EmailService.logPath, provider.name, {to, subject, ...result});
                if (result) return result;
            } catch (err) {
               // logProviderResponse(EmailService.logPath, provider.name, {to, subject, ...err}, true);
            }
        }
        throw new Error('All email providers failed');
    }

    async sendConfirmationEmail(to, token, provider = null) {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const { success, error } = await this.sendEmail(to, subject, body, provider);
        if (!success) {
            console.error('❌ Failed to send confirmation email:', error);
            return false;
        }
        return true;
    }

    async sendUnsubscribeEmail(to, city, provider = null) {
        const subject = "You've been unsubscribed";
        const body = buildUnsubscribeEmail(city);
        const { success, error } = await this.sendEmail(to, subject, body, provider);
        if (!success) {
            console.error('❌ Failed to send unsubscribe email:', error);
            return false;
        }
        return true;
    }

    async sendWeatherUpdate(email, city, weather, token, provider = null) {
        const subject = `SkyFetch Weather Update for ${city}`;
        const html = buildWeatherUpdateEmail(city, weather, token);
        const { success, error } = await this.sendEmail(email, subject, html, provider);
        if (!success) {
            console.error(`❌ Failed to send weather update to ${email}:`, error?.message || error);
            return false;
        }
        console.log(`📧 Weather update sent to ${email}`);
        return true;
    }

    async sendUpdates(frequency, provider = null) {
        const subs = await this.subscriptionRepo.findAllSubs({ confirmed: true, frequency });
        let sent = 0;
        let failed = 0;
        let skipped = 0;
        for (const sub of subs) {
            try {
                const weather = await this.weatherService.fetchWeather(sub.city);
                if (!weather) {
                    console.warn(`⚠️ No weather data available for ${sub.city}, skipping ${sub.email}`);
                    skipped++;
                    continue;
                }
                const ok = await this.sendWeatherUpdate(sub.email, sub.city, weather, sub.token, provider);
                if (ok) {
                    sent++;
                    console.log(`✅ ${frequency} email sent to ${sub.email}`);
                } else {
                    failed++;
                    console.error(`❌ Email send failed for ${sub.email}`);
                }
            } catch (err) {
                failed++;
                console.error(`❌ Failed ${frequency} for ${sub.email}:`, err.message);
            }
        }
        return { sent, failed, skipped };
    }
}

module.exports = EmailService;