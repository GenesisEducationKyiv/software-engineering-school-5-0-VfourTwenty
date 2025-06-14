const IEmailProvider = require("./emailProviderBase");
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

class EmailProvider1 extends IEmailProvider {
    get name() {
        return "Resend";
    }

    async sendEmail(to, subject, body) {
        try {
            const result = await resend.emails.send({
                from: fromEmail,
                to,
                subject,
                html: body
            });

            // Handle rate limit response
            if (result.error?.statusCode === 429) {
                console.warn(`⚠️ Rate limit hit for ${to}. Retrying after 0.5s...`);
                await delay(510);
                return await resend.emails.send({
                    from: fromEmail,
                    to,
                    subject,
                    html: body
                });
            }

            return result;

        } catch (err) {
            console.error('❌ ResendProvider: Failed to send email:', err);
            return null;
        }
    }
}

module.exports = EmailProvider1;
