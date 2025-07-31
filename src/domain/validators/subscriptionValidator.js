const { emailRegex } = require('../../common/utils/strings');
const Result = require('../types/result');

class SubscriptionValidator 
{
    constructor(cityValidator)
    {
        this.cityValidator = cityValidator;
    }

    async validateNewSubscription(email, city, frequency) 
    {
        if (!email || !city || !frequency) 
        {
            return new Result(false, 'MISSING REQUIRED FIELDS');
        }
        if (!emailRegex.test(email)) 
        {
            return new Result(false, 'INVALID EMAIL FORMAT');
        }
        if (!['hourly', 'daily'].includes(frequency)) 
        {
            return new Result(false, 'INVALID FREQUENCY');
        }
        const cityIsValid = await this.cityValidator.validate(city);
        if (!cityIsValid) return new Result(false, 'INVALID CITY');
        return new Result(true);
    }
}

module.exports = SubscriptionValidator;
