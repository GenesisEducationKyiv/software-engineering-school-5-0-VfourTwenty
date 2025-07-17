class SubscribeUserUseCase
{
    // depends on a service interface
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    async subscribe(email, city, frequency)
    {
        return this.subscriptionService.subscribeUser(email, city, frequency);
    }
}

module.exports = SubscribeUserUseCase;
