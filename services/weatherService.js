const providerState  = require('../providers/state.js');

function fetchWeather(city)
{
    return providerState.activeWeatherProvider.fetchWeather(city);
}

module.exports = { fetchWeather }
