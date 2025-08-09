class EmailController
{
    constructor(emailService)
    {
        this.emailService = emailService;
    }

    sendEmail = async (req, res) =>
    {
        const { to, subject, html } = req.body;
        const result = await this.emailService.sendEmail(to, subject, html);
        console.log('result of sending an email: ', result);
        if (result.success)
        {
            return res.status(200).json({ message: 'EMAIL SUCCEEDED' });
        }
        else return res.status(500).json({ error: 'FAILED TO SEND EMAIL' });
    };
}

module.exports = EmailController;
