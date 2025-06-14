const {Subscription, WeatherData} = require("../db/models");

require('dotenv').config();
const env = process.env.NODE_ENV || 'docker';
const config = require('../config/config.js')[env];
const BASE_URL = config.baseUrl;

const { confirmEmailTemplate, unsubscribeEmailTemplate, weatherUpdateEmailTemplate } = require('./emailTemplates');
const { sendEmail } = require('../services/emailService');

async function sendConfirmationEmail(to, confirmUrl) {
    try {
        const subject = 'Confirm your weather subscription';
        const body = confirmEmailTemplate(confirmUrl);

        return await sendEmail(to, subject, body);
    } catch (err) {
        console.error('❌ Failed to send confirmation email:', err);
        return null;
    }
}

async function sendUnsubscribeEmail(to, city) {
    try {
        const subject = 'You’ve been unsubscribed';
        const body = unsubscribeEmailTemplate(city);

        return await sendEmail(to, subject, body);
    } catch (err) {
        console.error('❌ Failed to send unsubscribe email:', err);
        return null;
    }
}

async function sendWeatherUpdate(email, city, weather, token) {
    try {
        const subject = `SkyFetch Weather Update for ${city}`;
        const unsubUrl = `${BASE_URL}/unsubscribe/${token}`;
        const html = weatherUpdateEmailTemplate(city, weather, unsubUrl);

        const response = await sendEmail(email, subject, html);
        console.log(`📧 Weather update sent to ${email}`, response);

        return response;
    } catch (err) {
        console.error(`❌ Failed to send weather update to ${email}:`, err.message || err);
        return null;
    }
}


async function sendUpdates(frequency) {
    const subs = await Subscription.findAll({
        where: { confirmed: true, frequency }
    });

    for (const sub of subs) {
        try {
            const weather = await WeatherData.findByPk(sub.city);
            if (!weather) {
                console.warn(`⚠️ No weather data cached for ${sub.city}, skipping ${sub.email}`);
                continue;
            }
            await sendWeatherUpdate(sub.email, sub.city, weather.toJSON(), sub.token);
            console.log(`✅ ${frequency} email sent to ${sub.email}`);
        } catch (err) {
            console.error(`❌ Failed ${frequency} for ${sub.email}:`, err.message);
        }
    }
}

module.exports = {
    sendConfirmationEmail,
    sendUnsubscribeEmail,
    sendUpdates
};
