const config = require('../common/config');
const Result = require('../common/utils/result');
const { buildConfirmEmail, buildUnsubscribedEmail, buildWeatherUpdateEmail } = require('../common/utils/emailTemplates');
const metricsKeys = require('../common/metrics/metricsKeys');

class EmailChannel
{
    constructor(logger, metricsProvider)
    {
        this.log = logger.for('NotificationEmailChannel');
        this.metricsProvider = metricsProvider;
    }

    async _sendEmail(to, subject, body)
    {
        try 
        {
            const emailResult = await fetch(`${config.emailUrl}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: to,
                    subject: subject,
                    html: body
                })
            });
            const emailResJson = await emailResult.json();
            this.log.debug('Called email service', emailResJson);
            if (emailResult.status !== 200)
            {
                this.log.error('Email service failed', emailResJson.err);
                return new Result(false, 'EMAIL SERVICE FAILED');
            }
            this.log.info('Email service succeeded');
            return new Result(true);
        }
        catch (err)
        {
            this.log.error('Failed to call email service', err);
            return new Result(false, 'EMAIL SERVICE FAILED');
        }
    }

    async sendConfirmationEmail(to, token)
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const result = await this._sendEmail(to, subject, body);
        this.log.debug('Confirmation email result', result);
        this.metricsProvider.incrementCounter(metricsKeys.CONFIRMATION_EMAILS_TOTAL, 1, { success: result.success });
        return result.success;
    }

    async sendUnsubscribedEmail(to, city)
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribedEmail(city);
        const result = await this._sendEmail(to, subject, body);
        this.log.debug('Unsubscribed email result', result);
        this.metricsProvider.incrementCounter(metricsKeys.UNSUBSCRIBED_EMAILS_TOTAL, 1, { success: result.success });
        return result.success;
    }

    async _sendWeatherUpdate(email, city, weather, token)
    {
        const subject = `SkyFetch Weather Update for ${city}`;
        const html = buildWeatherUpdateEmail(city, weather, token);
        const result = await this._sendEmail(email, subject, html);
        this.log.debug('Weather Update email result', result);
        this.metricsProvider.incrementCounter(metricsKeys.WEATHER_UPDATE_EMAILS_TOTAL, 1, { success: result.success });
        return result.success;
    }

    async sendWeatherUpdates(payload) 
    {
        const { city, weather, subscribers } = payload;
        let sent = 0, failed = 0;

        for (const sub of subscribers) 
        {
            try 
            {
                const result = await this._sendWeatherUpdate(sub.email, city, weather, sub.token);
                if (result) 
                {
                    sent++;
                    this.log.info(`📧 Weather update sent to ${sub.email}`);
                }
                else 
                {
                    failed++;
                    this.log.warn(`❌ Failed to send weather update to ${sub.email}`);
                }
            }
            catch (err) 
            {
                failed++;
                this.log.error(`❌ Error sending weather update to ${sub.email}:`, err.message);
            }
        }

        return { sent, failed };
    }
}

module.exports = EmailChannel;
