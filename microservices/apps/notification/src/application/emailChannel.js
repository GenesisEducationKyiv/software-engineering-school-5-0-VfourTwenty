const config = require('../common/config');
const Result = require('../common/utils/result');
const { buildConfirmEmail, buildUnsubscribedEmail, buildWeatherUpdateEmail } = require('../common/utils/emailTemplates');

class EmailChannel
{
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
            console.log('fetched from email service: ', emailResJson);
            //console.log('fetched from email service', await emailResult.json());
            if (emailResult.status !== 200) return new Result(false, 'EMAIL SERVICE FAILED');
            return new Result(true);
        }
        catch (err)
        {
            console.log('error calling email service from backend: ', err);
            return new Result(false, 'EMAIL SERVICE FAILED');
        }
    }

    async sendConfirmationEmail(to, token)
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const result = await this._sendEmail(to, subject, body);
        return result.success;
    }

    async sendUnsubscribedEmail(to, city)
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribedEmail(city);
        const result = await this._sendEmail(to, subject, body);
        return result.success;
    }

    async _sendWeatherUpdate(email, city, weather, token)
    {
        const subject = `SkyFetch Weather Update for ${city}`;
        const html = buildWeatherUpdateEmail(city, weather, token);
        const result = await this._sendEmail(email, subject, html);
        if (!result.success)
        {
            return false;
        }
        console.log(`📧 Weather update sent to ${email}`);
        return true;
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
                    console.log(`📧 Weather update sent to ${sub.email}`);
                }
                else 
                {
                    failed++;
                    console.error(`❌ Failed to send weather update to ${sub.email}`);
                }
            }
            catch (err) 
            {
                failed++;
                console.error(`❌ Error sending weather update to ${sub.email}:`, err.message);
            }
        }

        return { sent, failed };
    }
}

module.exports = EmailChannel;
