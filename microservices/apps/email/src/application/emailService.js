const Result = require('../common/utils/result');
const metricsKeys = require('../common/metrics/metricsKeys');

class EmailService
{
    // emailProvider implements IEmailProvider
    constructor(emailProvider, metricsProvider)
    {
        this.emailProvider = emailProvider;
        this.metricsProvider = metricsProvider;
    }

    async sendEmail(to, subject, body) 
    {
        const result = await this.emailProvider.sendEmail(to, subject, body);
        if (!result.success)
        {
            this.metricsProvider.incrementCounter(metricsKeys.EMAILS_FAILED_TOTAL);
            return new Result(false, 'EMAIL FAILED');
        }
        this.metricsProvider.incrementCounter(metricsKeys.EMAILS_SENT_TOTAL);
        return result;
    }
}

module.exports = EmailService;
