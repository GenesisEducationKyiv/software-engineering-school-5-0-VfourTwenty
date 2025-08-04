require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const frontendUrl = 'http://localhost:5001';
const weatherCurrentUrl = 'http://weather:4002/api/weather-current';
const subscriptionUrl = 'http://subscription:4003/api';
const emailUrl = 'http://email:4004/api'

module.exports = {
    frontendUrl,
    weatherCurrentUrl,
    subscriptionUrl,
    emailUrl
};
