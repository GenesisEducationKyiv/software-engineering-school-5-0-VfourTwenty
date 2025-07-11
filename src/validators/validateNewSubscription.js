const { emailRegex } = require('../utils/strings');
const SubscriptionError = require('../errors/SubscriptionError');

class SubscriptionValidator 
{
    constructor(subscriptionRepo, cityValidator) 
    {
        this.subscriptionRepo = subscriptionRepo;
        this.cityValidator = cityValidator;
    }

    async validateNewSubscription(email, city, frequency) 
    {
        if (!email || !city || !frequency) 
        {
            throw new SubscriptionError('MISSING REQUIRED FIELDS');
        }
        if (!emailRegex.test(email)) 
        {
            throw new SubscriptionError('INVALID EMAIL FORMAT');
        }
        if (!['hourly', 'daily'].includes(frequency)) 
        {
            throw new SubscriptionError('INVALID FREQUENCY');
        }
        this.cityValidator.validate(city);
        const exists = await this.subscriptionRepo.findSub({ email, city, frequency });
        if (exists) 
        {
            throw new SubscriptionError('DUPLICATE');
        }
    }
}

module.exports = SubscriptionValidator;
