const IEmailProvider = require('./emailProviderInterface');
const { Resend } = require('resend');

const config = require('../../config/index');
const fromEmail = config.fromEmail;
const resend = new Resend(config.resendApiKey);

const retry = require('../../utils/retry');

const DTO = require('../../types/dto');

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
            return new DTO(true, '');
        };
        try 
        {
            // Resend allows for 2 requests per second,
            // therefore delay of 510 ms ensures that the
            // next request will happen within next second
            await retry(send, 4, 510);
            return new DTO(true, '');
        }
        catch (err) 
        {
            console.error('❌ Resend failed:', err);
            return new DTO(false, err);
        }
    }
}

module.exports = ResendEmailProvider;
