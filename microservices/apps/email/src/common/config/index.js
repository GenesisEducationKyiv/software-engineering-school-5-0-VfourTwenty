require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const fromEmail = process.env.FROM_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;

module.exports = {
    fromEmail,
    resendApiKey
};
