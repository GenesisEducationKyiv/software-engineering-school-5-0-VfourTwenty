const Result = require('../../../src/domain/types/result');
const {emailRegex} = require("../../../src/utils/strings");

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

class SubscriptionValidatorMock
{
    async validateNewSubscription(email, city, frequency)
    {
        if (!email || !city || !frequency)
        {
            return new Result(false, 'MISSING REQUIRED FIELDS');
        }
        // should fail in confirmation email use case
        else if ((email === validSub.email || email === 'shouldfail@mail.com') && city === validSub.city && frequency === validSub.frequency)
        {
            return new Result(true);
        }
        else if (!emailRegex.test(email))
        {
            return new Result(false, 'INVALID EMAIL FORMAT');
        }
        else if (!['hourly', 'daily'].includes(frequency))
        {
            return new Result(false, 'INVALID FREQUENCY');
        }
        else if (city !== validSub.city)
        {
            return new Result(false, 'INVALID CITY');
        }
    }
}

module.exports = SubscriptionValidatorMock;