const { genToken } = require('../utils/strings');
const DTO = require('../domain/types/dto');
const SubscriptionDTO = require('../domain/types/subscription');

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
        const validationResult = await this.validator.validateNewSubscription(email, city, frequency);
        // DTO with sub validation errors mapped
        if (!validationResult.success) return validationResult;
        const duplicateCheckResult = await this.subscriptionRepo.findSub({ email: email, city: city, frequency: frequency });
        if (duplicateCheckResult.success) return new DTO(false, 'DUPLICATE');
        const token = genToken();
        await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });

        const emailResult = await this.confirmationEmailUseCase.sendConfirmationEmail(email, token);
        if (!emailResult.success) return new DTO(false, 'SUBSCRIBED BUT CONFIRM EMAIL FAILED');
        return new SubscriptionDTO(true, '', { token: token });
    }

    async confirmSubscription(token) 
    {
        if (!token || token.length < 10) return new DTO(false, 'INVALID TOKEN');
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.subscription;
        if (!sub) return new DTO(false, 'TOKEN NOT FOUND');
        if (sub.confirmed) return new DTO(false, 'ALREADY CONFIRMED');
        await this.subscriptionRepo.confirmSub(token);
        return new DTO(true, '');
    }

    async unsubscribeUser(token) 
    {
        if (!token || token.length < 10) return new DTO(false, 'INVALID TOKEN');
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.subscription;
        if (!sub) return new DTO(false, 'TOKEN NOT FOUND');
        await this.subscriptionRepo.deleteSub(token);
        const emailResult = await this.unsubscribeEmailUseCase.sendUnsubscribeEmail(sub.email, sub.city);
        if (!emailResult.success) return new DTO(false, 'UNSUBSCRIBED BUT EMAIL FAILED');
        return new DTO(true, '');
    }

    async findSub(params) 
    {
        return await this.subscriptionRepo.findSub(params);
    }
}

module.exports = SubscriptionService;
