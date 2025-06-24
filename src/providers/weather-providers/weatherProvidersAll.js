const WeatherApiProvider = require("./WeatherAPIProvider");
const weatherProviders = [new WeatherApiProvider()]

function setActiveWeatherProvider(provider) {
    if (weatherProviders.includes(provider)) {
        state.activeWeatherProvider = provider;
    } else {
        throw new Error("Invalid provider");
    }
}

module.exports = weatherProviders;