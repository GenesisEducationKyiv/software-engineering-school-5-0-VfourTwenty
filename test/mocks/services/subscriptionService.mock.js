class SubscriptionServiceMock
{
    stub(value)
    {
        this.returnValue = value;
    }

    async subscribeUser(email, city, frequency)
    {
        return this.returnValue;
    }

    async confirmSubscription(token)
    {
        return this.returnValue;
    }

    async unsubscribeUser(token)
    {
        return this.returnValue;
    }

    async findSub(params)
    {
        return this.returnValue;
    }

    async findAllSubs(params)
    {
        return this.returnValue;
    }
}

module.exports = SubscriptionServiceMock;
