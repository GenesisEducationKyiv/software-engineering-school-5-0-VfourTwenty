const { expect } = require('chai');
const SubscriptionUseCase = require('../../../src/application/use-cases/subscriptionUseCase');
const CityValidatorMock = require('../../mocks/validators/cityValidator.mock');
const SubscriptionServiceMock = require('../../mocks/services/subscriptionService.mock');
const QueuePublisherMock = require('../../mocks/queue/queuePublisher.mock')

const Result = require('../../../src/common/utils/result');

const cityValidatorMock = new CityValidatorMock();
const subscriptionServiceMock = new SubscriptionServiceMock();
const queuePublisherMock = new QueuePublisherMock();
const subscriptionUseCase = new SubscriptionUseCase(cityValidatorMock, subscriptionServiceMock, queuePublisherMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
};

describe('SubscriptionUseCase Unit Tests', () =>
{
    it('should return a successful response from subscription service for subscribe', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, 'some-valid-token'));

        // Act
        const result = await subscriptionUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service fo subscribe if sub already exists', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'DUPLICATE'));

        // Act
        const result = await subscriptionUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });

    it('should return a failing response from subscription service if confirmation email fails', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'SUBSCRIBED BUT CONFIRM EMAIL FAILED'));

        // Act
        const result = await subscriptionUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('SUBSCRIBED BUT CONFIRM EMAIL FAILED');
    });

    it('should return a successful response from subscription service for confirm', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true));

        // Act
        const result = await subscriptionUseCase.confirm('some-valid-token');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'ALREADY CONFIRMED'));

        // Act
        const result = await subscriptionUseCase.confirm('some-valid-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('ALREADY CONFIRMED');
    });

    it('should return a successful response from subscription service for unsubscribe', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, { email: 'valid@mail.com', city: 'city' }));

        // Act
        const result = await subscriptionUseCase.unsubscribe('some-valid-token');

        // Assert
        expect(result.success).to.be.true;
        expect(result.data).to.deep.eq({ email: 'valid@mail.com', city: 'city' });
    });

    it('should return a failing response from subscription service for unsubscribe if deleting a sub fails', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'TOKEN NOT FOUND'));

        // Act
        const result = await subscriptionUseCase.unsubscribe('some-valid-token');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('TOKEN NOT FOUND');
    });
});
