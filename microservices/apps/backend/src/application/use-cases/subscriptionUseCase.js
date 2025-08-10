const events = require('../../common/queue/events');
const metricsKeys = require('../../common/metrics/metricsKeys');

class SubscriptionUseCase
{
    constructor(
        cityValidator,
        subscriptionService,
        queuePublisher,
        logger,
        metricsProvider
    )
    {
        this.cityValidator = cityValidator;
        this.subscriptionService = subscriptionService;
        this.queuePublisher = queuePublisher;
        this.log = logger.for('SubscriptionUseCase');
        this.metricsProvider = metricsProvider;
    }

    async subscribe(email, city, frequency)
    {
        const validationResult = await this.cityValidator.validate(city);
        if (!validationResult.success) return validationResult;
        this.log.info(`City validation passed for ${city}`);

        const subscriptionResult = await this.subscriptionService.subscribeUser(email, city, frequency);
        this.log.info('Subscription service responded to subscribe', subscriptionResult);

        if (subscriptionResult.success)
        {
            const token = subscriptionResult.data.token;
            this.queuePublisher.publish(
                events.USER_SUBSCRIBED,
                { email, token }
            );
            this.metricsProvider.incrementCounter(metricsKeys.QUEUE_JOBS_PUBLISHED, 1,
                { event: events.USER_SUBSCRIBED }
            );
        }
        return subscriptionResult;
    }

    async confirm(token)
    {
        const confirmResult = this.subscriptionService.confirmSubscription(token);
        this.log.info('Subscription service responded to confirm', confirmResult);
        return confirmResult;
    }

    async unsubscribe(token)
    {
        const unsubscribeResult = await this.subscriptionService.unsubscribeUser(token);
        if (unsubscribeResult.success)
        {
            const sub = unsubscribeResult.data;
            this.queuePublisher.publish(
                events.USER_UNSUBSCRIBED,
                { email: sub.email, city: sub.city }
            );
            this.metricsProvider.incrementCounter(metricsKeys.QUEUE_JOBS_PUBLISHED, 1,
                { event: events.USER_UNSUBSCRIBED }
            );
        }
        this.log.info('Subscription service responded to unsubscribe', unsubscribeResult);
        return unsubscribeResult;
    }
}

module.exports = SubscriptionUseCase;
