class EmailProviderManagerMock {
    async sendEmail(to, subject, html)
    {
        if (to === 'shouldfail@mail.com')
        {
            return { success: false, err: "email failed"}
        }
        else if (to === 'shouldreturnnull@mail.com')
        {
            return null;
        }
        return { success: true }
    }
}

module.exports = EmailProviderManagerMock;
