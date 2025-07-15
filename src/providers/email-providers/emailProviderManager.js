const IEmailProvider = require('./emailProviderInterface');
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
                if (result && result.success) return result;
            }
            catch (err)
            {
                console.log(err);
                //   logProviderResponse(this.logPath, provider.name, { to, subject, error: err }, true);
            }
        }
        return null;
    }
}

module.exports = EmailProviderManager;
