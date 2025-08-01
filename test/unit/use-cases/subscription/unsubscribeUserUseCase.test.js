const { expect } = require('chai');
const UnsubscribeUserUseCase = require('../../../../src/application/use-cases/subscription/unsubscribeUserUseCase');
const EmailServiceMock = require('../../../mocks/services/emailService.mock');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const Result = require('../../../../src/domain/types/result');

const subscriptionServiceMock = new SubscriptionServiceMock();
const emailServiceMock = new EmailServiceMock();
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionServiceMock, emailServiceMock);

describe('UnsubscribeSubscriptionUseCase Unit Tests', () => 
{
    it('should return a successful response from subscription service', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, { email: 'valid@mail.com', city: 'city' }));

        // Act
        const result = await unsubscribeUserUseCase.unsubscribe('some-valid-token');

        // Assert
        expect(result.success).to.be.true;
        expect(result.data).to.deep.eq({ email: 'valid@mail.com', city: 'city' });
    });

    it('should return a failing response from subscription service is deleting a sub fails', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'TOKEN NOT FOUND'));

        // Act
        const result = await unsubscribeUserUseCase.unsubscribe('some-valid-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });

    it('should return a failing response from subscription service if unsubscribed email fails', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'UNSUBSCRIBED BUT EMAIL FAILED'));

        // Act
        const result = await unsubscribeUserUseCase.unsubscribe('some-valid-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('UNSUBSCRIBED BUT EMAIL FAILED');
    });
});
