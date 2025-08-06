const { expect } = require('chai');
const EmailService = require('../../../src/application/emailService');
const EmailProviderManagerMock = require('../../mocks/providers/emailProviderManager.mock');

const emailProviderManagerMock = new EmailProviderManagerMock();
const emailService = new EmailService(emailProviderManagerMock);

describe('EmailService Unit Tests', () => 
{
    it('should return true for success if sending an email succeeds', async () => 
    {
        // Act
        const result = await emailService.sendEmail('valid@mail.com', 'hello', 'hello');

        // Assert
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if sending an email fails', async () => 
    {
        // Act
        const result = await emailService.sendEmail('shouldfail@mail.com', 'hello', 'hello');

        // Assert
        expect(result.success).to.be.false;
        expect(result.err).to.eq('EMAIL FAILED');
    });
});
