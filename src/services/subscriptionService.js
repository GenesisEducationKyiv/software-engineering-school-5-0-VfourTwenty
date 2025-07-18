const { genToken } = require('../utils/strings');
const SubscriptionError = require('../domain/errors/SubscriptionError');
const DTO = require('../domain/types/dto');

class SubscriptionService
{
    constructor(confirmationEmailUseCase, unsubscribeEmailUseCase, subscriptionRepo, subscriptionValidator)
    {
        // these two are from the domain layer
        this.confirmationEmailUseCase = confirmationEmailUseCase;
        this.unsubscribeEmailUseCase = unsubscribeEmailUseCase;
        //
        this.subscriptionRepo = subscriptionRepo;
        this.validator = subscriptionValidator;
    }

    async subscribeUser(email, city, frequency) 
    {
        const { success, err } = await this.validator.validateNewSubscription(email, city, frequency);
        if (!success) throw new SubscriptionError(err);
        const token = genToken();
        await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });

        const emailResult = await this.confirmationEmailUseCase.sendConfirmationEmail(email, token);
        if (!emailResult.success) return new DTO(false, 'SUBSCRIBED BUT CONFIRM EMAIL FAILED');
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
        const emailResult = await this.unsubscribeEmailUseCase.sendUnsubscribeEmail(sub.email, sub.city);
        if (!emailResult.success) return new DTO(false, 'UNSUBSCRIBED BUT EMAIL FAILED');
        return sub;
    }

    async findSub(params) 
    {
        return await this.subscriptionRepo.findSub(params);
    }
}

module.exports = SubscriptionService;
