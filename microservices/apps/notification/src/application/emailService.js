const config = require('../common/config');
const Result = require('../domain/types/result');
const { buildConfirmEmail, buildUnsubscribedEmail } = require('../common/utils/emailTemplates');

class EmailService
{
    async _sendEmail(to, subject, body)
    {
        try {
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
}

module.exports = EmailService;
