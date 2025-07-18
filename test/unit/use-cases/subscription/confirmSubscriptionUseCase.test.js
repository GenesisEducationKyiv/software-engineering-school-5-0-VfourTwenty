const {expect} = require("chai");
const ConfirmSubscriptionUseCase = require('../../../../src/domain/use-cases/subscription/confirmSubscriptionUseCase');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const DTO = require('../../../../src/domain/types/dto');

const subscriptionServiceMock = new SubscriptionServiceMock();
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionServiceMock);

describe('ConfirmSubscriptionUseCase Unit Tests', () => {
    it('should return a successful response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(true, ''));
        const result = await confirmSubscriptionUseCase.confirm('some-valid-token');
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service', async () => {
        subscriptionServiceMock.stub(new DTO(false, 'ALREADY CONFIRMED'));
        const result = await confirmSubscriptionUseCase.confirm('some-valid-token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('ALREADY CONFIRMED');
    });
});