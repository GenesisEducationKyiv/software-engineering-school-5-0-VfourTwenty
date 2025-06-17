const IProvider = require("../providerBase");

class IEmailProvider extends IProvider {
    async sendEmail(to, subject, body) {
        throw new Error("sendEmail() must be implemented by subclass");
    }

    async ping() {
        try {
            const response = await this.sendEmail(
                process.env.TEST_TO_EMAIL,
                'SkyFetch: Resend email service health check',
                '<p>Checking if Resend is up...</p>'
            );

            if (response?.error) {
                throw new Error(`Ping failed with provider error: ${response.error.message || JSON.stringify(response.error)}`);
            }

            console.log(`✅ Ping successful: ${this.name}`);
        } catch (err) {
            console.error(`❌ Ping failed for ${this.name}:`, err.message || err);
        }
    }
}


module.exports = IEmailProvider;

