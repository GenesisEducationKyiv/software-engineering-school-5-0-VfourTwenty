const IEmailProvider = require('../../../../domain/interfaces/providers/emailProviderInterface');
const Result = require('../../../../common/utils/result');

class EmailProviderManager extends IEmailProvider 
{
    constructor(providers, logger)
    {
        super();
        this.providers = providers;
        this.log = logger.for('EmailProviderManager');
    }

    async sendEmail(to, subject, body) 
    {
        // sending an email is atomic action, it cannot be performed partially
        // so there is no need for a separate result object in the current setup
        for (const provider of this.providers)
        {
            try 
            {
                const result = await provider.sendEmail(to, subject, body);
                this.log.info(`Sending email to ${to}`);
                this.log.debug(`Email subject: {${subject}} and body: {${body}}`);

                if (result.success)
                {
                    this.log.info(`Provider ${provider.name} has succeeded.`);
                    return new Result(true);
                }
                this.log.warn(`External provider ${provider.name} has failed.`);
            }
            catch (err)
            {
                console.log(err);
                this.log.error('External provider error', JSON.stringify(err));
            }
        }
        this.log.error('All external providers have failed');
        return new Result(false, 'all email providers have failed');
    }
}

module.exports = EmailProviderManager;
