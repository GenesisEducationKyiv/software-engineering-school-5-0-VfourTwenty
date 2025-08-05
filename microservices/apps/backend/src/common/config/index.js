require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const frontendUrl = process.env.FRONTEND_URL;
const weatherUrl = process.env.WEATHER_URL;
const subscriptionUrl = process.env.SUBSCRIPTION_URL;
const emailUrl = process.env.EMAIL_URL;

module.exports = {
    frontendUrl,
    weatherUrl,
    subscriptionUrl,
    emailUrl
};
