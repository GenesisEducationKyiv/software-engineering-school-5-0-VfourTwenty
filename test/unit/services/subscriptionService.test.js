const {expect} = require("chai");

const SubscriptionService = require('../../../src/services/subscriptionService');

const EmailServiceMock = require('../../mocks/services/emailService.mock');
const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const SubscriptionValidatorMock = require('../../mocks/validators/subscriptionValidator.mock');

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
        console.log('token: ', token);
        // default length passed to the util function is 20
        // but its doubled as token is generated as a hex value
        expect(token.length).to.eq(40);
    });
});