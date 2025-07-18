//const EmailError = require('../domain/errors/EmailError');
const DTO = require('../domain/types/dto');

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
            return new DTO(false, 'EMAIL FAILED');
            // throw new EmailError('EMAIL FAILED');
        }
        return result;
    }
}

module.exports = EmailService;
