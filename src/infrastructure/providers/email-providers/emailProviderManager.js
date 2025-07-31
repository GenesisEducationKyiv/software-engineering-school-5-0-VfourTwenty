const IEmailProvider = require('../../../domain/interfaces/providers/emailProviderInterface');
const Result = require('../../../domain/types/result');
// const { logProviderResponse } = require('../../utils/logger');
// const path = require('path');

class EmailProviderManager extends IEmailProvider 
{
    constructor(providers)
    {
        super();
        this.providers = providers;
        // this.logPath = path.join(__dirname, '../../../logs/emailProvider.log');
    }

    async sendEmail(to, subject, body) 
    {
        for (const provider of this.providers) 
        {
            try 
            {
                const result = await provider.sendEmail(to, subject, body);
                //    logProviderResponse(this.logPath, provider.name, { to, subject, ...result });
                if (result.success) return new Result(true);
                console.log(`Email provider ${provider.name} has failed: ${result.err}`);
                // log result.err
            }
            catch (err)
            {
                console.log(err);
                //   logProviderResponse(this.logPath, provider.name, { to, subject, error: err }, true);
            }
        }
        return new Result(false, 'all email providers have failed');
    }
}

module.exports = EmailProviderManager;
