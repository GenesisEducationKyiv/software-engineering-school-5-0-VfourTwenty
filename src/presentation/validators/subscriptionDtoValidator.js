const { emailRegex } = require('../../common/utils/strings');
const Result = require('../../domain/types/result');

class SubscriptionDtoValidator
{
    validateNewSubscription(email, city, frequency)
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
        return new Result(true);
    }

    validateToken(token)
    {
        if (!token || token.length < 10)
        {
            return new Result(false, 'INVALID TOKEN');
        }
        return new Result(true);
    }
}

module.exports = SubscriptionDtoValidator;
