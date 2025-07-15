const IEmailProvider = require('../../../src/providers/email-providers/emailProviderInterface');

class EmailProviderMock1 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email1@mail.com')
        {
            return { success: true }
        }
        else
        {
            return {success: false, error: new Error('Email provider 1 failed')}
        }
    }
}

class EmailProviderMock2 extends IEmailProvider
{
    async sendEmail(to, subject, body)
    {
        if (to === 'email2@mail.com')
        {
            return { success: true }
        }
        else
        {
            return {success: false, error: new Error('Email provider 2 failed')}
        }
    }
}

module.exports = { EmailProviderMock1, EmailProviderMock2 }