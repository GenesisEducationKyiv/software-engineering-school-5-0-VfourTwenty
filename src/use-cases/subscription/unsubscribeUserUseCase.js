const { buildUnsubscribedEmail } = require('../../common/utils/emailTemplates');
const Result = require('../../domain/types/result');

class UnsubscribeUserUseCase
{
    // depends on a service interface
    constructor(subscriptionService, emailService)
    {
        this.subscriptionService = subscriptionService;
        this.emailService = emailService;
    }

    async _sendUnsubscribedEmail(to, city)
    {
        const subject = 'You\'ve been unsubscribed';
        const body = buildUnsubscribedEmail(city);
        const result = await this.emailService.sendEmail(to, subject, body);
        return result.success;
    }

    async unsubscribe(token)
    {
        const unsubscribeResult = await this.subscriptionService.unsubscribeUser(token);
        if (!unsubscribeResult.success)
        {
            return unsubscribeResult;
        }
        const { email, city } = unsubscribeResult.data;
        const emailSuccess = await this._sendUnsubscribedEmail(email, city);
        if (!emailSuccess) return new Result(false, 'UNSUBSCRIBED BUT EMAIL FAILED');
        return unsubscribeResult;
    }
}

module.exports = UnsubscribeUserUseCase;

