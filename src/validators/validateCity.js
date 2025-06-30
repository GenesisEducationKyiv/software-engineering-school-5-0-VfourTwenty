const WeatherService = require('../services/weatherService')

async function validateCity(city) {
    try {
        await WeatherService.fetchWeather(city);
        return true;
    } catch (err) {
        if (err.message === 'No data available for this location' || err.message === 'No matching location found.') {
            throw new Error('INVALID CITY');
        }
        throw err;
    }
}

module.exports = validateCity;