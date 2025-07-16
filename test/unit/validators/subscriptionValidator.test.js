const {expect} = require("chai");
const SubscriptionValidator = require('../../../src/validators/subscriptionValidator');
const SubscriptionError = require('../../../src/errors/SubscriptionError');

const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const CityValidatorMock = require('../../mocks/validators/cityValidator.mock');

const subscriptionRepoMock = new SubscriptionRepoMock();
const cityValidatorMock = new CityValidatorMock();
const subscriptionValidator = new SubscriptionValidator(subscriptionRepoMock, cityValidatorMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

describe('SubscriptionValidator Unit Tests', () => {

    it('should return true for success for valid subscription data', async () => {
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, validSub.frequency);
        expect(result).to.deep.eq({ success: true, err: '' });
    });

    it('should return false for success and an error message for missing email', async () => {
        const result = await subscriptionValidator.validateNewSubscription(null, validSub.city, validSub.frequency);
        expect(result).to.deep.eq({ success: false, err: 'MISSING REQUIRED FIELDS' });
    });

    it('should return false for success and an error message for missing city', async () => {
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, null, validSub.frequency);
        expect(result).to.deep.eq({ success: false, err: 'MISSING REQUIRED FIELDS' });
    });

    it('should return false for success and an error message for missing frequency', async () => {
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, null);
        expect(result).to.deep.eq({ success: false, err: 'MISSING REQUIRED FIELDS' });
    });

    it('should return false for success and an error message for invalid email format', async () => {
        const result = await subscriptionValidator.validateNewSubscription('invalid-email', validSub.city, validSub.frequency);
        expect(result).to.deep.eq({ success: false, err: 'INVALID EMAIL FORMAT' });
    });

    it('should return false for success and an error message for invalid frequency', async () => {
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, 'apple');
        expect(result).to.deep.eq({ success: false, err: 'INVALID FREQUENCY' });
    });

    it('should return false for success and an error message for invalid city', async () => {
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, 'nfgfgh', validSub.frequency);
        expect(result).to.deep.eq({ success: false, err: 'INVALID CITY' });
    });

    it('should return false for success and an error message for duplicate subscription', async () => {
        await subscriptionRepoMock.createSub(validSub);
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, validSub.frequency);
        expect(result).to.deep.eq({ success: false, err: 'DUPLICATE' });
    });
});