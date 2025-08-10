const { genToken } = require('../common/utils/strings');
const Result = require('../common/utils/result');
const metricsKeys = require('../common/metrics/metricsKeys');

class SubscriptionService
{
    constructor(subscriptionRepo, logger, metricsProvider)
    {
        this.subscriptionRepo = subscriptionRepo;
        this.log = logger.for('SubscriptionService');
        this.metricsProvider = metricsProvider;
    }

    async subscribeUser(email, city, frequency) 
    {
        const duplicateCheckResult = await this.subscriptionRepo.findSub({ email: email, city: city, frequency: frequency });
        if (duplicateCheckResult.success)
        {
            this.log.warn('Duplicate subscription attempt', duplicateCheckResult.data);
            return new Result(false, 'DUPLICATE');
        }

        const token = genToken();
        const createResult = await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });
        if (!createResult.success)
        {
            this.log.error('Failed to create subscription', createResult.err);
            return new Result(false, 'FAILED TO CREATE SUBSCRIPTION');
        }

        this.log.info('Created new subscription', { email, city, frequency });
        this.metricsProvider.incrementCounter(metricsKeys.SUBSCRIPTIONS_CREATED_TOTAL);
        return new Result(true, null, { token: token });
    }

    async confirmSubscription(token) 
    {
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.data;
        if (!sub)
        {
            this.log.warn('Subscription not found', result.err);
            return new Result(false, 'TOKEN NOT FOUND');
        }

        if (sub.confirmed)
        {
            this.log.warn('Duplicate confirmation attempt', sub);
            return new Result(false, 'ALREADY CONFIRMED');
        }

        const confirmResult = await this.subscriptionRepo.confirmSub(token);
        if (!confirmResult.success)
        {
            this.log.error('Confirmation failed', confirmResult.err);
            return new Result(false, 'CONFIRMATION FAILED');
        }

        this.log.info('Subscription confirmed', sub);
        this.metricsProvider.incrementCounter(metricsKeys.SUBSCRIPTIONS_CONFIRMED_TOTAL);
        return new Result(true, null, { city: sub.city, frequency: sub.frequency });
    }

    async unsubscribeUser(token) 
    {
        const result = await this.subscriptionRepo.findSub({ token });
        const sub = result.data;
        if (!sub)
        {
            this.log.warn('Subscription not found', result.err);
            return new Result(false, 'TOKEN NOT FOUND');
        }

        const deleteResult = await this.subscriptionRepo.deleteSub(token);
        if (!deleteResult.success)
        {
            this.log.error('Failed to delete subscription', deleteResult.err);
            return new Result(false, 'FAILED TO DELETE SUBSCRIPTION');
        }

        this.log.info('Subscription deleted', sub);
        this.metricsProvider.incrementCounter(metricsKeys.SUBSCRIPTIONS_CANCELED_TOTAL);
        return new Result(true, null, { email: sub.email, city: sub.city });
    }

    async findSub(params) 
    {
        const result = await this.subscriptionRepo.findSub(params);
        this.log.debug('findSub result', result);
        return result;
    }

    async findAllSubs(params)
    {
        const result = await this.subscriptionRepo.findAllSubs(params);
        this.log.debug('find all subs success and error', { success: result.success, error: result.err });
        return result;
    }

    async clear()
    {
        const result = await this.subscriptionRepo.clear();
        this.log.debug('Clear subscriptions called. Result: ', result);
        return result;
    }
}

module.exports = SubscriptionService;
