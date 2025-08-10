const events = require('../../common/queue/events');

class SubscriptionUseCase
{
    constructor(cityValidator, subscriptionService, queuePublisher)
    {
        this.cityValidator = cityValidator;
        this.subscriptionService = subscriptionService;
        this.queuePublisher = queuePublisher;
    }

    async subscribe(email, city, frequency)
    {
        const validationResult = await this.cityValidator.validate(city);
        if (!validationResult.success) return validationResult;
        console.log('just passed city validation (in use-case)');

        const subscriptionResult = await this.subscriptionService.subscribeUser(email, city, frequency);
        console.log('subscription service responded to subscribe: ', subscriptionResult);

        if (subscriptionResult.success)
        {
            const token = subscriptionResult.data.token;
            this.queuePublisher.publish(
                events.USER_SUBSCRIBED,
                { email, token }
            );
        }
        return subscriptionResult;
    }

    async confirm(token)
    {
        return this.subscriptionService.confirmSubscription(token);
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
        }
        return unsubscribeResult;
    }
}

module.exports = SubscriptionUseCase;
