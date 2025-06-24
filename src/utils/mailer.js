const {Subscription, WeatherData} = require("../db/models");

require('dotenv').config();
const env = process.env.NODE_ENV;
const config = require('../config/config.js')[env];
const BASE_URL = config.baseUrl;

const { confirmEmailTemplate, unsubscribeEmailTemplate, weatherUpdateEmailTemplate } = require('./emailTemplates');
const { sendEmail } = require('../services/emailService');
const { SubscriptionRepo } = require("../repositories/subscriptionRepo");


async function sendConfirmationEmail(to, confirmUrl) {
    const subject = 'Confirm your weather subscription';
    const body = confirmEmailTemplate(confirmUrl);

    const { success, error } = await sendEmail(to, subject, body);

    if (!success) {
        console.error('❌ Failed to send confirmation email:', error);
        return false;
    }

    return true;
}


async function sendUnsubscribeEmail(to, city) {
    const subject = 'You’ve been unsubscribed';
    const body = unsubscribeEmailTemplate(city);

    const { success, error } = await sendEmail(to, subject, body);

    if (!success) {
        console.error('❌ Failed to send unsubscribe email:', error);
        return false;
    }

    return true;
}

async function sendWeatherUpdate(email, city, weather, token) {
    const subject = `SkyFetch Weather Update for ${city}`;
    const unsubUrl = `${BASE_URL}/unsubscribe/${token}`;
    const html = weatherUpdateEmailTemplate(city, weather, unsubUrl);

    const { success, error } = await sendEmail(email, subject, html);

    if (!success) {
        console.error(`❌ Failed to send weather update to ${email}:`, error?.message || error);
        return false;
    }

    console.log(`📧 Weather update sent to ${email}`);
    return true;
}

async function sendUpdates(frequency) {
    const subs = await SubscriptionRepo.findAllBy({ confirmed: true, frequency })

    let sent   = 0;
    let failed = 0;
    let skipped = 0;

    for (const sub of subs) {
        try {
            const weather = await WeatherData.findByPk(sub.city);
            if (!weather) {
                console.warn(`⚠️ No weather data cached for ${sub.city}, skipping ${sub.email}`);
                skipped++;
                continue;
            }

            const ok = await sendWeatherUpdate(sub.email, sub.city, weather.toJSON(), sub.token);

            if (ok) {
                sent++;
                console.log(`✅ ${frequency} email sent to ${sub.email}`);
            } else {
                failed++;
                console.error(`❌ Email send failed for ${sub.email}`);
            }
        } catch (err) {
            failed++;
            console.error(`❌ Failed ${frequency} for ${sub.email}:`, err.message);
        }
    }

    return { sent, failed, skipped };
}

module.exports = {
    sendConfirmationEmail,
    sendUnsubscribeEmail,
    sendUpdates
};
