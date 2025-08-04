class ISubscriptionService
{
    constructor(subscriptionRepo)
    {
        this.subscriptionRepo = subscriptionRepo;
    }

    async subscribeUser(email, city, frequency)
    {
        throw new Error('subscribeUser() must be implemented by subclass');
    }

    async confirmSubscription(token)
    {
        throw new Error('confirmSubscription() must be implemented by subclass');
    }

    async unsubscribeUser(token)
    {
        throw new Error('unsubscribeUser() must be implemented by subclass');
    }

    async findSub(params)
    {
        throw new Error('findSub() must be implemented by subclass');
    }

    async findAllSubs(params)
    {
        throw new Error('findAllSubs() must be implemented by subclass');
    }
}

module.exports = ISubscriptionService;

