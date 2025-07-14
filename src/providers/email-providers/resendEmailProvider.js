const IEmailProvider = require('./emailProviderInterface');
const { Resend } = require('resend');
//require('dotenv').config();
const retry = require('../../utils/retry');

const config = require('../../config/index');
const resend = new Resend(config.resendApiKey);
const fromEmail = config.fromEmail;

class ResendEmailProvider extends IEmailProvider 
{
    get name() 
    {
        return 'Resend';
    }

    async sendEmail(to, subject, html) 
    {
        const send = async () => 
        {
            const result = await resend.emails.send({
                from: fromEmail,
                to,
                subject,
                html,
            });
            if (result.error?.statusCode === 429) 
            {
                throw new Error('429');
            }
            return result;
        };
        try 
        {
            // Resend allows for 2 requests per second,
            // therefore delay of 510 ms ensures that the
            // next request will happen within next second
            await retry(send, 4, 510);
            return { success: true };
        }
        catch (err) 
        {
            console.error('❌ Resend failed:', err);
            return { success: false, error: err };
        }
    }
}

module.exports = ResendEmailProvider;
