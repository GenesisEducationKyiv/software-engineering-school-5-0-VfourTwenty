const {expect} = require("chai");
const SubscriptionValidator = require('../../../src/domain/validators/subscriptionValidator');
const CityValidatorMock = require('../../mocks/validators/cityValidator.mock');

const cityValidatorMock = new CityValidatorMock();
const subscriptionValidator = new SubscriptionValidator(cityValidatorMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

describe('SubscriptionValidator Unit Tests', () => {

    it('should return true for success for valid subscription data', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message for missing email', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(null, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for missing city', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, null, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for missing frequency', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, null);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for invalid email format', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription('invalid-email', validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID EMAIL FORMAT');
    });

    it('should return false for success and an error message for invalid frequency', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, validSub.city, 'apple');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID FREQUENCY');
    });

    it('should return false for success and an error message for invalid city', async () => {
        // Act
        const result = await subscriptionValidator.validateNewSubscription(validSub.email, 'nfgfgh', validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID CITY');
    });
});