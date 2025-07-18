const IEmailProvider = require('./emailProviderInterface');
const DTO = require('../../domain/types/dto');
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
                if (result.success) return new DTO(true, '');
                else return new DTO(false, result.err);
                // log result.err
            }
            catch (err)
            {
                console.log(err);
                return new DTO(false, err.message);
                //   logProviderResponse(this.logPath, provider.name, { to, subject, error: err }, true);
            }
        }
        return null;
    }
}

module.exports = EmailProviderManager;
