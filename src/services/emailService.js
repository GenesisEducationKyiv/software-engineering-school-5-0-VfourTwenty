const Result = require('../domain/types/result');

class EmailService 
{
    constructor(emailProviderManager)
    {
        this.emailProviderManager = emailProviderManager;
    }

    async sendEmail(to, subject, body) 
    {
        const result = await this.emailProviderManager.sendEmail(to, subject, body);
        if (!result.success)
        {
            return new Result(false, 'EMAIL FAILED');
        }
        return result;
    }
}

module.exports = EmailService;
