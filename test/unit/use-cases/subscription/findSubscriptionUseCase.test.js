const {expect} = require("chai");
const FindSubscriptionUseCase = require('../../../../src/domain/use-cases/subscription/findSubscriptionUseCase');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const DTO = require('../../../../src/domain/types/dto');
const SubscriptionDTO = require('../../../../src/domain/types/subscription');

const subscriptionServiceMock = new SubscriptionServiceMock();
const findSubscriptionUseCase = new FindSubscriptionUseCase(subscriptionServiceMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly',
    confirmed: false,
    token: 'some-valid-token'
}

describe('FindSubscriptionUseCase Unit Tests', () => {
    it('should return a successful response from subscription service', async () => {
        subscriptionServiceMock.stub(new SubscriptionDTO(true, '', validSub));
        const result = await findSubscriptionUseCase.find(validSub.token);
        expect(result.success).to.be.true;
        expect(result.subscription).to.deep.eq(validSub);
    });

    it('should return a failing response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(false, 'Subscription not found'));
        const result = await findSubscriptionUseCase.find(validSub.token);
        expect(result.success).to.be.false;
        expect(result.err).to.eq('Subscription not found');
    });
});