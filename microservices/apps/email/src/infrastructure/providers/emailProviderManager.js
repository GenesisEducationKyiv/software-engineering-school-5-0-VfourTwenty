const IEmailProvider = require('../../domain/interfaces/emailProviderInterface');
const Result = require('../../common/utils/result');
const metricsKeys = require('../../common/metrics/metricsKeys');

class EmailProviderManager extends IEmailProvider 
{
    constructor(providers, metricsProvider)
    {
        super();
        this.providers = providers;
        this.metricsProvider = metricsProvider;
    }

    async sendEmail(to, subject, body) 
    {
        for (const provider of this.providers) 
        {
            try 
            {
                const result = await provider.sendEmail(to, subject, body);
                if (result.success)
                {
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
                console.log(`Email provider ${provider.name} has failed: ${result.err}`);
            }
            catch (err)
            {
                console.log('Error in Email Provider manager: ', err);
            }
        }
        return new Result(false, 'all email providers have failed');
    }
}

module.exports = EmailProviderManager;
