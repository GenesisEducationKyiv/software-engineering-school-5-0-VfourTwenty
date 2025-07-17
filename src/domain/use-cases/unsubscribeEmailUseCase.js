const { buildUnsubscribeEmail } = require('../../utils/emailTemplates');
const EmailError = require('../errors/EmailError');

class UnsubscribeEmailUseCase
{
    constructor(emailService)
    {
        this.emailService = emailService;
    }
    
    async sendUnsubscribeEmail(to, city)
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribeEmail(city);
        const success = await this.emailService.sendEmail(to, subject, body);
        if (!success)
        {
            throw new EmailError('UNSUBSCRIBE EMAIL FAILED');
        }
        return true;
    }
}

module.exports = UnsubscribeEmailUseCase;
