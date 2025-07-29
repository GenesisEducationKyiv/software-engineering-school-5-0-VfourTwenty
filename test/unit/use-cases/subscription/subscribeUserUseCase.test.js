const {expect} = require("chai");
const SubscribeUserUseCase = require('../../../../src/use-cases/subscription/subscribeUserUseCase');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const DTO = require('../../../../src/domain/types/dto');

const subscriptionServiceMock = new SubscriptionServiceMock();
const subscribeUserUseCase = new SubscribeUserUseCase(subscriptionServiceMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
}

describe('subscribeSubscriptionUseCase Unit Tests', () => {
    it('should return a successful response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(true, ''));
        const result = await subscribeUserUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(false, 'DUPLICATE'));
        const result = await subscribeUserUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });
});