const { genToken } = require('../utils/strings');
const DTO = require('../domain/types/dto');
const SubscriptionDTO = require('../domain/types/subscription');

class SubscriptionService
{
    constructor(subscriptionRepo)
    {
        this.subscriptionRepo = subscriptionRepo;
    }

    async subscribeUser(email, city, frequency) 
    {
        const duplicateCheckResult = await this.subscriptionRepo.findSub({ email: email, city: city, frequency: frequency });
        if (duplicateCheckResult.success) return new DTO(false, 'DUPLICATE');
        const token = genToken();
        await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });

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
        return new SubscriptionDTO(true, '', { city: sub.city, frequency: sub.frequency });
    }

    async unsubscribeUser(token) 
    {
        if (!token || token.length < 10) return new DTO(false, 'INVALID TOKEN');
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.subscription;
        if (!sub) return new DTO(false, 'TOKEN NOT FOUND');
        await this.subscriptionRepo.deleteSub(token);
        return new SubscriptionDTO(true, '', { email: sub.email, city: sub.city });
    }

    async findSub(params) 
    {
        return await this.subscriptionRepo.findSub(params);
    }

    async findAllSubs(params)
    {
        return await this.subscriptionRepo.findAllSubs(params);
    }
}

module.exports = SubscriptionService;
