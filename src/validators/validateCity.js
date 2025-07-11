async function validateCity(city, weatherService) {
    try {
        await weatherService.fetchWeather(city);
        return true;
    } catch (err) {
        if (err.message === 'No data available for this location' || err.message === 'No matching location found.') {
            throw new Error('INVALID CITY');
        }
        throw err;
    }
}

module.exports = validateCity;