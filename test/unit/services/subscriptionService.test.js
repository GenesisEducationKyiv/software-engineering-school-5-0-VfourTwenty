const {expect} = require("chai");
const SubscriptionService = require('../../../src/services/subscriptionService');

const ConfirmEmailUseCaseMock = require('../../mocks/use-cases/confirmationEmailUseCase.mock');
const UnsubscribeEmailUseCaseMock = require('../../mocks/use-cases/unsubscribeEmailUseCase.mock');
const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const SubscriptionValidatorMock = require('../../mocks/validators/subscriptionValidator.mock');

const confirmationEmailUseCaseMock = new ConfirmEmailUseCaseMock();
const unsubscribeEmailUseCaseMock = new UnsubscribeEmailUseCaseMock();
const subscriptionRepoMock = new SubscriptionRepoMock();
const subscriptionValidatorMock = new SubscriptionValidatorMock();

const subscriptionService = new SubscriptionService(confirmationEmailUseCaseMock, unsubscribeEmailUseCaseMock, subscriptionRepoMock, subscriptionValidatorMock);

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
        const token = result.subscription.token;
        expect(token).to.be.a('string');
        // default length passed to the util function is 20
        // but its doubled as token is generated as a hex value
        expect(token.length).to.eq(40);
    });

    it('should return false for success and an error message for missing email', async () => {
        const result = await subscriptionService.subscribeUser(null, validSub.city, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for missing city', async () => {
        const result = await subscriptionService.subscribeUser(validSub.email, null, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for missing frequency', async () => {
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, null);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('MISSING REQUIRED FIELDS');
    });

    it('should return false for success and an error message for invalid frequency', async () => {
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, 'apple');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID FREQUENCY');
    });

    it('should return false for success and an error message for invalid city', async () => {
        const result = await subscriptionService.subscribeUser(validSub.email, 'InvalidCity', validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('INVALID CITY');
    });

    it('should return false for success and an error message for duplicate subscription', async () => {
        await subscriptionRepoMock.createSub(validSub);
        const result = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });

    it('should return false for success and an error message if sending a confirmation email fails', async () => {
        const result = await subscriptionService.subscribeUser('shouldfail@mail.com', validSub.city, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('SUBSCRIBED BUT CONFIRM EMAIL FAILED');
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
        const result = await subscriptionService.confirmSubscription('confirmation-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });

    it('should return false for success and an error message if sending an unsubscribed email fails', async () => {
        await subscriptionRepoMock.createSub({...validSub, email: 'shouldfail@mail.com', confirmed: true, token: 'unsubscribe-token'});
        const result = await subscriptionService.unsubscribeUser('unsubscribe-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('UNSUBSCRIBED BUT EMAIL FAILED');
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