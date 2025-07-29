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
    beforeEach(async () => {
        await subscriptionRepoMock.clear();
    });

    it('should subscribe a user with valid credentials and return a valid token', async () => {
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);
        expect(result.success).to.be.true;
        const token = result.data.token;
        expect(token).to.be.a('string');
        // default length passed to the util function is 20
        // but its doubled as token is generated as a hex value
        expect(token.length).to.eq(40);
    });

    it('should return false for success and an error message for duplicate subscription', async () => {
        await subscriptionRepoMock.createSub(validSub);
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });


    it('should return true for success after confirming a valid subscription', async () => {
        await subscriptionRepoMock.createSub({...validSub, confirmed: false, token: 'confirmation-token'});
        const result = await subscriptionService.confirmSubscription('confirmation-token');
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if token is missing in confirm', async () => {
        const result = await subscriptionService.confirmSubscription();
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID TOKEN');
    });

    it('should return false for success and an error message if subscription doesnt exist in confirm', async () => {
        const result = await subscriptionService.confirmSubscription('confirmation-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });

    it('should return false for success and an error message if for duplicate confirmation attempt', async () => {
        await subscriptionRepoMock.createSub({...validSub, confirmed: true, token: 'confirmation-token'});
        const result = await subscriptionService.confirmSubscription('confirmation-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('ALREADY CONFIRMED');
    });

    it('should return true for success after unsubscribing a user with a valid token', async () => {
        await subscriptionRepoMock.createSub({...validSub, confirmed: true, token: 'unsubscribe-token'});
        const result = await subscriptionService.unsubscribeUser('unsubscribe-token');
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if token is missing in unsubscribe', async () => {
        const result = await subscriptionService.unsubscribeUser();
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID TOKEN');
    });

    it('should return false for success and an error message if subscription doesnt exist in unsubscribe', async () => {
        const result = await subscriptionService.unsubscribeUser('confirmation-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });


    it('should return true for success and subscription data when an existing sub is queried', async () => {
        await subscriptionRepoMock.createSub(validSub);
        const result = await subscriptionService.findSub(validSub);
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message when an non-existing sub is queried', async () => {
        const result = await subscriptionService.findSub(validSub);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('Subscription not found');
    });
});