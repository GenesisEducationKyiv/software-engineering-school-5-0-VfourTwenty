const { buildUnsubscribeEmail } = require('../../../utils/emailTemplates');
// const EmailError = require('../../errors/EmailError');
const DTO = require('../../types/dto');

class UnsubscribeEmailUseCase
{
    // depends on a service interface
    constructor(emailService)
    {
        this.emailService = emailService;
    }
    
    async sendUnsubscribeEmail(to, city)
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribeEmail(city);
        const result = await this.emailService.sendEmail(to, subject, body);
        if (!result.success)
        {
            return new DTO(false, 'UNSUBSCRIBED EMAIL FAILED');
            // throw new EmailError('UNSUBSCRIBE EMAIL FAILED');
        }
        return result;
        // return true;
    }
}

module.exports = UnsubscribeEmailUseCase;
