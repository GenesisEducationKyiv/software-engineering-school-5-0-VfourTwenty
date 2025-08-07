const IEmailProvider = require('../../domain/interfaces/emailProviderInterface');
const Result = require('../../common/utils/result');

class EmailProviderManager extends IEmailProvider 
{
    constructor(providers)
    {
        super();
        this.providers = providers;
    }

    async sendEmail(to, subject, body) 
    {
        for (const provider of this.providers) 
        {
            try 
            {
                const result = await provider.sendEmail(to, subject, body);
                if (result.success) return new Result(true);
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
