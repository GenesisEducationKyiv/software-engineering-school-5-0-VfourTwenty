class FindSubscriptionUseCase
{
    // depends on a service interface
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    async find(token)
    {
        return this.subscriptionService.findSub({ token: token });
    }
}

module.exports = FindSubscriptionUseCase;
