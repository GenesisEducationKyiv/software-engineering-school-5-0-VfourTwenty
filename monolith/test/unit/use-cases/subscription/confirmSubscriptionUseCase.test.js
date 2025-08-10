const { expect } = require('chai');
const ConfirmSubscriptionUseCase = require('../../../../src/application/use-cases/subscription/confirmSubscriptionUseCase');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const Result = require('../../../../src/common/utils/result');

const subscriptionServiceMock = new SubscriptionServiceMock();
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionServiceMock);

describe('ConfirmSubscriptionUseCase Unit Tests', () => 
{
    it('should return a successful response from subscription service', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true));

        // Act
        const result = await confirmSubscriptionUseCase.confirm('some-valid-token');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'ALREADY CONFIRMED'));

        // Act
        const result = await confirmSubscriptionUseCase.confirm('some-valid-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('ALREADY CONFIRMED');
    });
});
