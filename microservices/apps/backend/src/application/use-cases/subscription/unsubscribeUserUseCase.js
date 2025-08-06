class UnsubscribeUserUseCase
{
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

