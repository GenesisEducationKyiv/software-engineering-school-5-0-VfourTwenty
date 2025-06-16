const Provider1 = require("./emailProvider1");
const emailProviders = [new Provider1()]

function setActiveEmailProvider(provider) {
    if (emailProviders.includes(provider)) {
        state.activeWeatherProvider = provider;
    } else {
        throw new Error("Invalid provider");
    }
}

module.exports = emailProviders;
