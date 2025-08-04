class IEmailService
{
    constructor(emailProvider)
    {
        this.emailProvider = emailProvider;
    }

    async sendEmail(to, subject, body)
    {
        throw new Error('sendEmail() must be implemented by subclass');
    }
}

module.exports = IEmailService;

