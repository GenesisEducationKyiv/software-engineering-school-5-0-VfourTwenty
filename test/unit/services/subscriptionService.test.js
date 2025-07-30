const {expect} = require("chai");
const SubscriptionService = require('../../../src/services/subscriptionService');

const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const subscriptionRepoMock = new SubscriptionRepoMock();

const subscriptionService = new SubscriptionService(subscriptionRepoMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

describe('SubscriptionService Unit Tests', () => {
    // Arrange
    beforeEach(async () => {
        await subscriptionRepoMock.clear();
    });

    it('should subscribe a user with valid credentials and return a valid token', async () => {
        // Act
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);
        const token = result.data.token;

        // Assert
        expect(result.success).to.be.true;
        expect(token).to.be.a('string');
        expect(token.length).to.be.greaterThan(0);
    });

    it('should return false for success and an error message for duplicate subscription', async () => {
        // Arrange
        await subscriptionRepoMock.createSub(validSub);

        // Act
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });


    it('should return true for success after confirming a valid subscription', async () => {
        // Arrange
        await subscriptionRepoMock.createSub({...validSub, confirmed: false, token: 'confirmation-token'});

        // Act
        const result = await subscriptionService.confirmSubscription('confirmation-token');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if token is missing in confirm', async () => {
        // Act
        const result = await subscriptionService.confirmSubscription();

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID TOKEN');
    });

    it('should return false for success and an error message if subscription doesnt exist in confirm', async () => {
        // Act
        const result = await subscriptionService.confirmSubscription('confirmation-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });

    it('should return false for success and an error message if for duplicate confirmation attempt', async () => {
        // Arrange
        await subscriptionRepoMock.createSub({...validSub, confirmed: true, token: 'confirmation-token'});

        // Act
        const result = await subscriptionService.confirmSubscription('confirmation-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('ALREADY CONFIRMED');
    });

    it('should return true for success after unsubscribing a user with a valid token', async () => {
        // Arrange
        await subscriptionRepoMock.createSub({...validSub, confirmed: true, token: 'unsubscribe-token'});

        // Act
        const result = await subscriptionService.unsubscribeUser('unsubscribe-token');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if token is missing in unsubscribe', async () => {
        // Act
        const result = await subscriptionService.unsubscribeUser();

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID TOKEN');
    });

    it('should return false for success and an error message if subscription doesnt exist in unsubscribe', async () => {
        // Act
        const result = await subscriptionService.unsubscribeUser('confirmation-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });


    it('should return true for success and subscription data when an existing sub is queried', async () => {
        // Arrange
        await subscriptionRepoMock.createSub(validSub);

        // Act
        const result = await subscriptionService.findSub(validSub);

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message when an non-existing sub is queried', async () => {
        // Act
        const result = await subscriptionService.findSub(validSub);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('SUBSCRIPTION NOT FOUND');
    });
});