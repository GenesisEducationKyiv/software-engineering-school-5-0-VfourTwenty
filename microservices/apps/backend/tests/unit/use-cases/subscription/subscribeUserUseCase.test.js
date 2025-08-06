const { expect } = require('chai');
const SubscribeUserUseCase = require('../../../../src/application/use-cases/subscription/subscribeUserUseCase');
const CityValidatorMock = require('../../../mocks/validators/cityValidator.mock');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');
const EmailServiceMock = require('../../../mocks/services/emailService.mock');

const Result = require('../../../../src/domain/types/result');

const cityValidatorMock = new CityValidatorMock();
const subscriptionServiceMock = new SubscriptionServiceMock();
const emailServiceMock = new EmailServiceMock();
const subscribeUserUseCase = new SubscribeUserUseCase(cityValidatorMock, subscriptionServiceMock, emailServiceMock);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
};

describe('subscribeSubscriptionUseCase Unit Tests', () => 
{
    it('should return a successful response from subscription service', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, 'some-valid-token'));

        // Act
        const result = await subscribeUserUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return a failing response from subscription service if sub already exists', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'DUPLICATE'));

        // Act
        const result = await subscribeUserUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('DUPLICATE');
    });

    it('should return a failing response from subscription service if confirmation email fails', async () => 
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(false, 'SUBSCRIBED BUT CONFIRM EMAIL FAILED'));

        // Act
        const result = await subscribeUserUseCase.subscribe(validSub.email, validSub.city, validSub.frequency);

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('SUBSCRIBED BUT CONFIRM EMAIL FAILED');
    });
});
