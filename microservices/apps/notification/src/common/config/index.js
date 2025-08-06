require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const emailUrl = process.env.EMAIL_URL;
const frontendUrl = process.env.FRONTEND_URL;

module.exports = {
    emailUrl,
    frontendUrl
};