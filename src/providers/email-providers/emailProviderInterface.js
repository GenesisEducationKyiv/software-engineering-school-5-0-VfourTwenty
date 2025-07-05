class EmailProviderInterface {
    async sendEmail(to, subject, body) {
        throw new Error("sendEmail() must be implemented by subclass");
    }
}

module.exports = EmailProviderInterface;

