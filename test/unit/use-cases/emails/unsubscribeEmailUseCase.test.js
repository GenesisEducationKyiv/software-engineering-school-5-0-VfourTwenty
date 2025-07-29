const {expect} = require("chai");
const UnsubscribeEmailUseCase = require('../../../../src/use-cases/emails/unsubscribeEmailUseCase');
const EmailServiceMock = require('../../../mocks/services/emailService.mock');

const emailServiceMock = new EmailServiceMock();
const unsubscribeEmailUseCase = new UnsubscribeEmailUseCase(emailServiceMock);

describe('UnsubscribeEmailUseCase Unit Tests', () => {

    it('should return true for success if email service succeeds', async () => {
        const result = await unsubscribeEmailUseCase.sendUnsubscribeEmail('valid@mail.com', 'token');
        expect(result.success).to.be.true;
    });

    it('should return false for success and an error message if email service fails', async () => {
        const result = await unsubscribeEmailUseCase.sendUnsubscribeEmail('shouldfail@mail.com', 'token');
        expect(result.success).to.be.false;
        expect(result.err).to.eq('UNSUBSCRIBED EMAIL FAILED');
    });
});