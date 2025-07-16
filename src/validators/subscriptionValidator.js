const { emailRegex } = require('../utils/strings');
const DTO = require('../../src/types/dto');

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
            return new DTO(false, 'MISSING REQUIRED FIELDS');
        }
        if (!emailRegex.test(email)) 
        {
            return new DTO(false, 'INVALID EMAIL FORMAT');
        }
        if (!['hourly', 'daily'].includes(frequency)) 
        {
            return new DTO(false, 'INVALID FREQUENCY');
        }
        const cityIsValid = await this.cityValidator.validate(city);
        if (!cityIsValid) return new DTO(false, 'INVALID CITY');
        const exists = await this.subscriptionRepo.findSub({ email, city, frequency });
        if (exists) 
        {
            return new DTO(false, 'DUPLICATE');
        }
        return new DTO(true, '');
    }
}

module.exports = SubscriptionValidator;
