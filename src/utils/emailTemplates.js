const config = require('../config/config.js')[process.env.NODE_ENV];

function buildConfirmEmail(token)
{
    const confirmLink = `${config.baseUrl}/confirm/${token}`;
    return `
        <p>Thanks for subscribing! Click <a href="${confirmLink}">here</a> to confirm your subscription :)</p>
      `;
}

function buildUnsubscribeEmail (city)
{
    return `
        <p>You have been unsubscribed from weather updates for <strong>${city}</strong>.</p>
      `;
}

function buildWeatherUpdateEmail(city, weather, token)
{
    const unsubUrl = `${config.baseUrl}/unsubscribe/${token}`;
    return  `
    <p>Here's your latest weather update for <strong>${city}</strong>:</p>
    <ul>
      <li><strong>Temperature:</strong> ${weather.temperature}°C</li>
      <li><strong>Humidity:</strong> ${weather.humidity}%</li>
      <li><strong>Condition:</strong> ${weather.description}</li>
    </ul>
    <p>To unsubscribe, click <a href="${unsubUrl}">here</a>.</p>
    <p style="font-size: 0.8rem; color: gray;">SkyFetch 2025 by <a href="https://github.com/VfourTwenty">VfourTwenty</a></p>
  `
}

module.exports = { buildConfirmEmail, buildUnsubscribeEmail, buildWeatherUpdateEmail };