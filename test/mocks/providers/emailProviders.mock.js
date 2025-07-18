const IEmailProvider = require('../../../src/providers/email-providers/emailProviderInterface');
const DTO = require('../../../src/domain/types/dto');

class EmailProviderMock1 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email1@mail.com')
        {
            return new DTO(true, '');
        }
        else
        {
            return new DTO(false, 'Email provider 1 has failed')
        }
    }
}

class EmailProviderMock2 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email2@mail.com')
        {
            return new DTO(true, '');
        }
        else
        {
            return new DTO(false, 'Email provider 2 has failed');
        }
    }
}

module.exports = { EmailProviderMock1, EmailProviderMock2 }