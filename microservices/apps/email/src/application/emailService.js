const Result = require('../common/utils/result');

class EmailService
{
    // emailProvider implements IEmailProvider
    constructor(emailProvider)
    {
        this.emailProvider = emailProvider;
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
