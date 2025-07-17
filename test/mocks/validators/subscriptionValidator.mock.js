const DTO = require('../../../src/types/dto');
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
            return new DTO(false, 'MISSING REQUIRED FIELDS');
        }
        else if ((email === validSub.email || email === 'emailshouldfail@mail.com') && city === validSub.city && frequency === validSub.frequency)
        {
            return new DTO(true, '');
        }
        else if (!emailRegex.test(email))
        {
            return new DTO(false, 'INVALID EMAIL FORMAT');
        }
        else if (!['hourly', 'daily'].includes(frequency))
        {
            return new DTO(false, 'INVALID FREQUENCY');
        }
        else if (city !== validSub.city)
        {
            return new DTO(false, 'INVALID CITY');
        }
        else if (email === 'duplicate@mail.com')
        {
            return new DTO(false, 'DUPLICATE');
        }
    }
}

module.exports = SubscriptionValidatorMock;