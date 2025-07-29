const {expect} = require("chai");
const UnsubscribeUserUseCase = require('../../../../src/use-cases/subscription/unsubscribeUserUseCase');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const DTO = require('../../../../src/domain/types/dto');

const subscriptionServiceMock = new SubscriptionServiceMock();
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionServiceMock);

describe('UnsubscribeSubscriptionUseCase Unit Tests', () => {
    it('should return a successful response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(true, ''));
        const result = await unsubscribeUserUseCase.unsubscribe('some-valid-token');
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(false, 'TOKEN NOT FOUND'));
        const result = await unsubscribeUserUseCase.unsubscribe('some-valid-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });
});