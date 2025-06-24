const WeatherCityRepo = require('../repositories/weatherCityRepo');
const WeatherDataRepo = require('../repositories/weatherDataRepo');
const { Op } = require('sequelize');

const { fetchWeather } = require("../services/weatherService");

// for cron jobs
async function fetchHourlyWeather() {
    const cities = await WeatherCityRepo.findAllBy({ hourly_count: { [Op.gt]: 0 } });

    console.log(`Fetching hourly weather for ${cities.length} cities...`);

    for (const { city } of cities) {
        try {
            const data = await fetchWeather(city);
            await WeatherDataRepo.upsert({
                city,
                temperature: data.temperature,
                humidity: data.humidity,
                description: data.description,
                fetchedAt: new Date()
            });
            console.log(`✅ Cached hourly weather for ${city}`);
        } catch (err) {
            console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
        }
    }
}

// reuse hourly fetches for cities that have both hourly and daily subs
async function fetchDailyWeather() {
    const cities = await WeatherCityRepo.findAllBy({ daily_count: { [Op.gt]: 0 }, hourly_count: 0 });

    console.log(`Fetching daily-only weather for ${cities.length} cities...`);

    for (const { city } of cities) {
        try {
            const data = await fetchWeather(city);
            await WeatherDataRepo.upsert({
                city,
                temperature: data.temperature,
                humidity: data.humidity,
                description: data.description,
                fetchedAt: new Date()
            });
            console.log(`✅ Cached daily-only weather for ${city}`);
        } catch (err) {
            console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
        }
    }
}

module.exports = {
    fetchHourlyWeather,
    fetchDailyWeather
};
