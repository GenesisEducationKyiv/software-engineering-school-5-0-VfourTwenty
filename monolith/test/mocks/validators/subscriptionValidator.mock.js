class SubscriptionDtoValidatorMock
{
    stub(value)
    {
        this.returnValue = value;
    }

    async validateNewSubscription(email, city, frequency)
    {
        return this.returnValue;
    }
}

module.exports = SubscriptionDtoValidatorMock;
