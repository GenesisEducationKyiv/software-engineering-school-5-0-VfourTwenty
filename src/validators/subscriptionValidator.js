const { emailRegex } = require('../utils/strings');

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
            return { success: false, err: 'MISSING REQUIRED FIELDS' };
        }
        if (!emailRegex.test(email)) 
        {
            return { success: false, err: 'INVALID EMAIL FORMAT' };
        }
        if (!['hourly', 'daily'].includes(frequency)) 
        {
            return { success: false, err: 'INVALID FREQUENCY' };
        }
        const cityIsValid = this.cityValidator.validate(city);
        if (!cityIsValid) return { success: false, err: 'INVALID CITY' };
        const exists = await this.subscriptionRepo.findSub({ email, city, frequency });
        if (exists) 
        {
            return { success: false, err: 'DUPLICATE' };
        }
        return { success: true };
    }
}

module.exports = SubscriptionValidator;
