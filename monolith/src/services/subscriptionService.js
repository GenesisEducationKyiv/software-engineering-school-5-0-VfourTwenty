const { genToken } = require('../common/utils/strings');
const Result = require('../domain/types/result');
const ISubscriptionService = require('../domain/interfaces/services/subscriptionServiceInterface');

class SubscriptionService extends ISubscriptionService
{
    constructor(subscriptionRepo)
    {
        super(subscriptionRepo);
    }

    async subscribeUser(email, city, frequency) 
    {
        const duplicateCheckResult = await this.subscriptionRepo.findSub({ email: email, city: city, frequency: frequency });
        if (duplicateCheckResult.success)
        {
            return new Result(false, 'DUPLICATE');
        }

        const token = genToken();
        const createResult = await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });
        if (!createResult.success)
        {
            return new Result(false, 'FAILED TO CREATE SUBSCRIPTION');
        }

        return new Result(true, null, { token: token });
    }

    async confirmSubscription(token) 
    {
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.data;
        if (!sub)
        {
            return new Result(false, 'TOKEN NOT FOUND');
        }

        if (sub.confirmed)
        {
            return new Result(false, 'ALREADY CONFIRMED');
        }

        const confirmResult = await this.subscriptionRepo.confirmSub(token);
        if (!confirmResult.success)
        {
            return new Result(false, 'CONFIRMATION FAILED');
        }

        return new Result(true, null, { city: sub.city, frequency: sub.frequency });
    }

    async unsubscribeUser(token) 
    {
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.data;
        if (!sub)
        {
            return new Result(false, 'TOKEN NOT FOUND');
        }

        const deleteResult = await this.subscriptionRepo.deleteSub(token);
        if (!deleteResult.success)
        {
            return new Result(false, 'FAILED TO DELETE SUBSCRIPTION');
        }

        return new Result(true, null, { email: sub.email, city: sub.city });
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
