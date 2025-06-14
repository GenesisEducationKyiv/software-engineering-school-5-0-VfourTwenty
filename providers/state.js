const emailProviders = require('./email-providers/emailProvidersAll');
const weatherProviders = require('./weather-providers/weatherProvidersAll');

const providerState = {
    activeEmailProvider: emailProviders[0],
    activeWeatherProvider: weatherProviders[0]
};

module.exports = providerState;
