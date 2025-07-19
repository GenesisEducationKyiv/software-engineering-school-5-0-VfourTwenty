const { buildConfirmEmail } = require('../../../utils/emailTemplates');
const DTO = require('../../types/dto');

class ConfirmationEmailUseCase
{
    // depends on a service interface
    constructor(emailService)
    {
        this.emailService = emailService;
    }

    async sendConfirmationEmail(to, token)
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const result = await this.emailService.sendEmail(to, subject, body);
        if (!result.success)
        {
            return new DTO(false, 'CONFIRMATION EMAIL FAILED');
        }
        return result;
    }
}

module.exports = ConfirmationEmailUseCase;
