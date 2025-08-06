const Result = require('../domain/types/result');
const IEmailService = require('../domain/interfaces/services/emailServiceInterface');

class EmailService extends IEmailService
{
    // emailProvider implements IEmailProvider
    constructor(emailProvider)
    {
        super(emailProvider);
    }

    async sendEmail(to, subject, body) 
    {
        const result = await this.emailProvider.sendEmail(to, subject, body);
        if (!result.success)
        {
            return new Result(false, 'EMAIL FAILED');
        }
        return result;
    }
}

module.exports = EmailService;
