class UnsubscribeUserUseCase
{
    // depends on a service interface
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    async unsubscribe(token)
    {
        return this.subscriptionService.unsubscribeUser(token);
    }
}

module.exports = UnsubscribeUserUseCase;

