const EmailError = require('../domain/errors/EmailError');

class EmailService 
{
    constructor(emailProviderManager)
    {
        this.emailProviderManager = emailProviderManager;
    }

    async sendEmail(to, subject, body) 
    {
        const result = await this.emailProviderManager.sendEmail(to, subject, body);
        if (!result)
        {
            throw new EmailError('EMAIL FAILED');
        }
        return result;
    }
}

module.exports = EmailService;
