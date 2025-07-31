const { buildConfirmEmail } = require('../../common/utils/emailTemplates');
const Result = require('../../domain/types/result');

class SubscribeUserUseCase
{
    // depends on a service interface
    constructor(subscriptionValidator, subscriptionService, emailService)
    {
        this.validator = subscriptionValidator;
        this.subscriptionService = subscriptionService;
        this.emailService = emailService;
    }

    async _sendConfirmationEmail(to, token)
    {
        const subject = 'Confirm your weather subscription';
        const body = buildConfirmEmail(token);
        const result = await this.emailService.sendEmail(to, subject, body);
        return result.success;
    }

    async subscribe(email, city, frequency)
    {
        const validationResult = await this.validator.validateNewSubscription(email, city, frequency);
        if (!validationResult.success) return validationResult;
        const subscriptionResult = await this.subscriptionService.subscribeUser(email, city, frequency);
        if (!subscriptionResult.success)
        {
            return subscriptionResult; // or new DTO(false, 'FAILED TO SUBSCRIBE)
        }
        const token = subscriptionResult.data.token;
        const emailSuccess = await this._sendConfirmationEmail(email, token);
        if (!emailSuccess) return new Result(false, 'SUBSCRIBED BUT CONFIRM EMAIL FAILED');
        return subscriptionResult;
    }
}

module.exports = SubscribeUserUseCase;
