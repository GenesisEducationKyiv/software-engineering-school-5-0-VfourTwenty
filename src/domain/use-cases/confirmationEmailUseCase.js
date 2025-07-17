const { buildConfirmEmail } = require('../../utils/emailTemplates');
const EmailError = require('../errors/EmailError');

class ConfirmationEmailUseCase
{
    constructor(emailService)
    {
        this.emailService = emailService;
    }

    async sendConfirmationEmail(to, token)
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const success = await this.emailService.sendEmail(to, subject, body);
        if (!success)
        {
            throw new EmailError('CONFIRMATION EMAIL FAILED');
        }
        return true;
    }
}

module.exports = ConfirmationEmailUseCase;
