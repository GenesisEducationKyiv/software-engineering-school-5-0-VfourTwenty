const { genToken } = require('../utils/strings');
const SubscriptionError = require('../errors/SubscriptionError');

class SubscriptionService
{
    constructor(emailService, subscriptionRepo, subscriptionValidator)
    {
        this.emailService = emailService;
        this.subscriptionRepo = subscriptionRepo;
        this.validator = subscriptionValidator;
    }

    async subscribeUser(email, city, frequency) 
    {
        await this.validator.validateNewSubscription(email, city, frequency);
        const token = genToken();
        await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });
        await this.emailService.sendConfirmationEmail(email, token);
        return token;
    }

    async confirmSubscription(token) 
    {
        if (!token || token.length < 10) throw new SubscriptionError('INVALID TOKEN');
        const sub = await this.subscriptionRepo.findSub({ token });
        if (!sub) throw new SubscriptionError('TOKEN NOT FOUND');
        if (sub.confirmed) throw new SubscriptionError('ALREADY CONFIRMED');
        await this.subscriptionRepo.confirmSub(token);
        return sub;
    }

    async unsubscribeUser(token) 
    {
        if (!token || token.length < 10) throw new SubscriptionError('INVALID TOKEN');
        const sub = await this.subscriptionRepo.findSub({ token });
        if (!sub) throw new SubscriptionError('TOKEN NOT FOUND');
        await this.subscriptionRepo.deleteSub(token);
        await this.emailService.sendUnsubscribeEmail(sub.email, sub.city);
        return sub;
    }

    async findSub(params) 
    {
        return await this.subscriptionRepo.findSub(params);
    }
}

module.exports = SubscriptionService;
