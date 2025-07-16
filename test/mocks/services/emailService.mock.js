const EmailError = require("../../../src/errors/EmailError");

class EmailServiceMock
{
    async sendConfirmationEmail(to, subject, body)
    {
        if (to === 'shouldfail@mail.com')
        {
            throw new EmailError('CONFIRMATION EMAIL FAILED');
        }
        return true;
    }

    async sendUnsubscribeEmail(to, subject, body)
    {
        if (to === 'shouldfail@mail.com')
        {
            throw new EmailError('UNSUBSCRIBE EMAIL FAILED');
        }
        return true;
    }
}

module.exports = EmailServiceMock;