const Provider1 = require("./weatherProvider1");
const weatherProviders = [new Provider1()]

function setActiveWeatherProvider(provider) {
    if (weatherProviders.includes(provider)) {
        state.activeWeatherProvider = provider;
    } else {
        throw new Error("Invalid provider");
    }
}

module.exports = weatherProviders;