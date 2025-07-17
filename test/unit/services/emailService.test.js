const { expect } = require('chai');
const EmailService = require('../../../src/services/emailService');
const EmailError = require('../../../src/domain/errors/EmailError');

const SubscriptionRepoMock = require('../../mocks/repositories/subscriptionRepo.mock');
const WeatherServiceMock = require('../../mocks/services/weatherService.mock')
const EmailProviderManagerMock = require('../../mocks/providers/emailProviderManager.mock');

const subscriptionRepoMock = new SubscriptionRepoMock();
const weatherServiceMock = new WeatherServiceMock();
const emailProviderManagerMock = new EmailProviderManagerMock();

const emailService = new EmailService(weatherServiceMock, subscriptionRepoMock, emailProviderManagerMock);

describe('EmailService Unit Tests', () => {

    it('should send an email to a valid address and return true for success', async () => {
        const result = await emailService.sendEmail('valid@mail.com', 'hello', 'hello');
        expect(result).to.be.deep.eq({ success: true });
    });

    it('should return false for success and an error message if email fails', async () => {
        const result = await emailService.sendEmail('shouldfail@mail.com', 'hello', 'hello');
        expect(result).to.be.deep.eq({ success: false, err: 'email failed' });
    });

    it('should throw an EmailError(EMAIL FAILED) if provided manager returns null', async() => {
        try {
            await emailService.sendEmail('shouldreturnnull@mail.com', 'hello', 'hello');
            expect.fail('Expected error not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(EmailError);
            expect(error.message).to.equal('EMAIL FAILED');
        }
    })
    // as currently Email Service also handles sending confirmation, unsubscribe and weather update emails,
    // it uses the same sendEmail(to, subject, body) function with the same error handling, this is not being
    // tested here. sending emails and business logic will be separated when switching to new architecture
    // and implementing event bus/message broker for logic unit communicating with other microservices
});
