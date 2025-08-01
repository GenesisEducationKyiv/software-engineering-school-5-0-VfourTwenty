class ConfirmSubscriptionUseCase
{
    // depends on a service interface
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    async confirm(token)
    {
        return this.subscriptionService.confirmSubscription(token);
    }
}

module.exports = ConfirmSubscriptionUseCase;
