const {expect} = require("chai");
const ConfirmationEmailUseCase = require('../../../../src/domain/use-cases/emails/confirmationEmailUseCase');
const EmailServiceMock = require('../../../mocks/services/emailService.mock');

const emailServiceMock = new EmailServiceMock();
const confirmationEmailUseCase = new ConfirmationEmailUseCase(emailServiceMock);

describe('ConfirmationEmailUseCase Unit Tests', () => {

    it('should return true for success if email service succeeds', async () => {
        const result = await confirmationEmailUseCase.sendConfirmationEmail('valid@mail.com', 'token');
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if email service fails', async () => {
        const result = await confirmationEmailUseCase.sendConfirmationEmail('shouldfail@mail.com', 'token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('CONFIRMATION EMAIL FAILED');
    });
});