const ResendEmailProvider = require("./ResendEmailProvider");
const emailProviders = [new ResendEmailProvider()]

function setActiveEmailProvider(provider) {
    if (emailProviders.includes(provider)) {
        state.activeWeatherProvider = provider;
    } else {
        throw new Error("Invalid provider");
    }
}

module.exports = emailProviders;
