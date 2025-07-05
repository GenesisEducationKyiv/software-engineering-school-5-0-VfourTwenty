const IEmailProvider = require('./emailProviderInterface');
const ResendEmailProvider = require('./resendEmailProvider');
const { logProviderResponse } = require('../../utils/logger');
const path = require('path');

class EmailProviderManager extends IEmailProvider {
    constructor() {
        super();
         this.providers = [new ResendEmailProvider() /*, add more providers here */];
        // this.logPath = path.join(__dirname, '../../../logs/emailProvider.log');
    }

    async sendEmail(to, subject, body) {
        for (const provider of this.providers) {
            try {
                const result = await provider.sendEmail(to, subject, body);
            //    logProviderResponse(this.logPath, provider.name, { to, subject, ...result });
                if (result && result.success) return result;
            } catch (err) {
             //   logProviderResponse(this.logPath, provider.name, { to, subject, error: err }, true);
            }
        }
        throw new Error('All email providers failed');
    }
}

module.exports = EmailProviderManager;
