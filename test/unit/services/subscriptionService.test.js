const {expect} = require("chai");

const SubscriptionService = require('../../../src/services/subscriptionService');

const EmailServiceMock = require('../../mocks/services/emailService.mock');
const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const SubscriptionValidatorMock = require('../../mocks/validators/subscriptionValidator.mock');
const EmailError = require("../../../src/errors/EmailError");
const SubscriptionError = require("../../../src/errors/SubscriptionError");

const emailServiceMock = new EmailServiceMock();
const subscriptionRepoMock = new SubscriptionRepoMock();
const subscriptionValidatorMock = new SubscriptionValidatorMock();

const subscriptionService = new SubscriptionService(emailServiceMock, subscriptionRepoMock, subscriptionValidatorMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

describe('SubscriptionService Unit Tests', () => {

    it('should subscribe a user with valid credentials and return a valid token', async () => {
        const token = await subscriptionService.subscribeUser(validSub.email, validSub.city, validSub.frequency);
        expect(token).to.be.a('string');
        // default length passed to the util function is 20
        // but its doubled as token is generated as a hex value
        expect(token.length).to.eq(40);
    });

    it('should throw a SubscriptionError for missing email', async () => {
        try {
            await subscriptionService.subscribeUser(null, validSub.city, validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('MISSING REQUIRED FIELDS');
        }
    });

    it('should throw a SubscriptionError for missing city', async () => {
        try {
            await subscriptionService.subscribeUser(validSub.email, null, validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('MISSING REQUIRED FIELDS');
        }
    });

    it('should throw a SubscriptionError for missing frequency', async () => {
        try {
            await subscriptionService.subscribeUser(validSub.email, validSub.city, null);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('MISSING REQUIRED FIELDS');
        }
    });

    it('should throw a SubscriptionError for invalid email format', async () => {
        try {
            await subscriptionService.subscribeUser('hello', validSub.city, validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('INVALID EMAIL FORMAT');
        }
    });

    it('should throw a SubscriptionError for invalid frequency', async () => {
        try {
            await subscriptionService.subscribeUser(validSub.email, validSub.city, 'hello');
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('INVALID FREQUENCY');
        }
    });

    it('should throw a SubscriptionError for invalid city', async () => {
        try {
            await subscriptionService.subscribeUser(validSub.email, 'hello', validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('INVALID CITY');
        }
    });

    it('should throw a SubscriptionError for duplicate subscription', async () => {
        try {
            // stubbed in the validator mock
            await subscriptionService.subscribeUser('duplicate@mail.com', validSub.city, validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(SubscriptionError);
            expect(error.message).to.equal('DUPLICATE');
        }
    });

    it('should rethrow an EmailError if sending a confirmation email fails', async () => {
        try {
            // stubbed in the email service mock
            await subscriptionService.subscribeUser('emailshouldfail@mail.com', validSub.city, validSub.frequency);
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(EmailError);
            expect(error.message).to.equal('CONFIRMATION EMAIL FAILED');
        }
    });
});