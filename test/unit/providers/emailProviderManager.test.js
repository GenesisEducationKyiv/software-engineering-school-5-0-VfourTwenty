const { expect } = require('chai');
const EmailProviderManager = require('../../../src/providers/email-providers/emailProviderManager');
const { EmailProviderMock1, EmailProviderMock2 } = require('../../mocks/providers/emailProviders.mock');

const mockedEmailProviders = [new EmailProviderMock1(), new EmailProviderMock2()];
const emailProviderManager = new EmailProviderManager(mockedEmailProviders);

// will add logging testing when logging has been implemented

describe('EmailProviderManager Unit Tests', () => {

    it('should return success when the first available provider succeeds', async () => {
        const response = await emailProviderManager.sendEmail('email1@mail.com', 'hello', 'hello')
        expect(response.success).to.be.true;
    })

    it('should delegate to the next provider and return success when the first available provider fails', async () => {
        const response = await emailProviderManager.sendEmail('email2@mail.com', 'hello', 'hello')
        expect(response.success).to.be.true;
    })

    it('should return null if all available providers fail', async () => {
        const response = await emailProviderManager.sendEmail('email3@mail.com', 'hello', 'hello')
        expect(response.success).to.be.false;
        expect(response.err).to.eq('all email providers have failed');
    })
});
