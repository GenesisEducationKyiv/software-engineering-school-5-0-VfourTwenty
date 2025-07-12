class EmailProviderManagerMock {
    async sendEmail(to, subject, html)
    {
        if (to === 'shouldfail@mail.com')
        {
            return { success: false, err: "email failed"}
        }
        return { success: true }
    }
}

module.exports = EmailProviderManagerMock;
