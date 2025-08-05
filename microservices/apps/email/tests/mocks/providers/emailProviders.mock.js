const IEmailProvider = require('../../../src/domain/interfaces/emailProviderInterface');
const Result = require('../../../src/domain/types/result');

class EmailProviderMock1 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email1@mail.com')
        {
            return new Result(true);
        }
        else
        {
            return new Result(false, 'Email provider 1 has failed');
        }
    }
}

class EmailProviderMock2 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email2@mail.com')
        {
            return new Result(true);
        }
        else
        {
            return new Result(false, 'Email provider 2 has failed');
        }
    }
}

module.exports = { EmailProviderMock1, EmailProviderMock2 };
