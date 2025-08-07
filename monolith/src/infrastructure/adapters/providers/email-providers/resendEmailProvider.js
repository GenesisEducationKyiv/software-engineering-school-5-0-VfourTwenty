const IEmailProvider = require('../../../../domain/interfaces/providers/emailProviderInterface');
const { Resend } = require('resend');

const config = require('../../../../common/config').email;
const fromEmail = config.fromEmail;
const resend = new Resend(config.resendApiKey);

const retry = require('../../../../common/utils/retry');

const Result = require('../../../../common/utils/result');

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
            return new Result(true);
        };
        try 
        {
            // Resend allows for 2 requests per second,
            // therefore delay of 510 ms ensures that the
            // next request will happen within next second
            await retry(send, 4, 510);
            return new Result(true);
        }
        catch (err) 
        {
            console.error('❌ Resend failed:', err);
            return new Result(false, 'Resend failed: ', err);
        }
    }
}

module.exports = ResendEmailProvider;
