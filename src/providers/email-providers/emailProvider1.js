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

    async sendEmail(to, subject, html) {
        try {
            const result = await resend.emails.send({
                from: fromEmail,
                to,
                subject,
                html,
            });

            if (result.error?.statusCode === 429) {
                console.warn(`⚠️ Rate limit hit for ${to}. Retrying...`);
                await delay(510);
                await resend.emails.send({ from: fromEmail, to, subject, html });
            }

            return { success: true }; // ✅ simple response
        } catch (err) {
            console.error('❌ Resend failed:', err);
            return { success: false, error: err }; // ✅ unified error
        }
    }
}

module.exports = EmailProvider1;
