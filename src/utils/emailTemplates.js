const confirmEmailTemplate = (confirmUrl) => `
        <p>Thanks for subscribing! Click below to confirm your subscription:</p>
        <a href="${confirmUrl}">${confirmUrl}</a>
      `;

const unsubscribeEmailTemplate = (city) => `
        <p>You have been unsubscribed from weather updates for <strong>${city}</strong>.</p>
      `

const weatherUpdateEmailTemplate = (city, weather, unsubUrl) => `
    <p>Here's your latest weather update for <strong>${city}</strong>:</p>
    <ul>
      <li><strong>Temperature:</strong> ${weather.temperature}°C</li>
      <li><strong>Humidity:</strong> ${weather.humidity}%</li>
      <li><strong>Condition:</strong> ${weather.description}</li>
    </ul>
    <p>To unsubscribe, click <a href="${unsubUrl}">here</a>.</p>
    <p style="font-size: 0.8rem; color: gray;">SkyFetch 2025 by VfourTwenty</p>
  `


module.exports = { confirmEmailTemplate, unsubscribeEmailTemplate, weatherUpdateEmailTemplate };