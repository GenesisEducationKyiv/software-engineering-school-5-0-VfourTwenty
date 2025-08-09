const IEmailProvider = require('../../domain/interfaces/emailProviderInterface');
const Result = require('../../common/utils/result');
const metricsKeys = require('../../common/metrics/metricsKeys');

class EmailProviderManager extends IEmailProvider 
{
    constructor(providers, logger, metricsProvider)
    {
        super();
        this.providers = providers;
        this.log = logger.for('EmailProviderManager');
        this.metricsProvider = metricsProvider;
    }

    async sendEmail(to, subject, body) 
    {
        for (const provider of this.providers) 
        {
            this.log.info(`Sending email to ${to}...`);
            this.log.debug(`Calling email provider ${provider.name}`);
            try 
            {
                const result = await provider.sendEmail(to, subject, body);
                if (result.success)
                {
                    this.log.info('Email sent', { to, subject, body });
                    this.metricsProvider.incrementCounter(metricsKeys.EXTERNAL_API_CALLS, 1, {
                        provider: provider.name,
                        success: true
                    });
                    return new Result(true);
                }
                this.metricsProvider.incrementCounter(metricsKeys.EXTERNAL_API_CALLS, 1, {
                    provider: provider.name,
                    success: false
                });
                this.log.warn(`Email provider ${provider.name} has failed: ${result.err}`);
            }
            catch (err)
            {
                this.log.error('Error in Email Provider manager: ', err);
            }
        }
        this.log.error('All email providers have failed');
    }
}

module.exports = EmailProviderManager;
