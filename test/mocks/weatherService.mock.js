console.log('weather service mock called');

async function fetchWeather(city)
{
    if (['Kyiv', 'Lviv', 'Odesa', 'Dnipro'].includes(city)) {
        return {
            temperature: 22,
            humidity: 60,
            description: 'Clear sky',
        };
    } else {
        const error = new Error('No matching location found.');
        error.response = { status: 404 };
        throw error;
    }
}
module.exports = { fetchWeather }
