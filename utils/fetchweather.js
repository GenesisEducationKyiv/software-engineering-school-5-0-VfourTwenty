const { WeatherCity, WeatherData } = require('../db/models');
const { Op } = require('sequelize');

const { fetchWeather } = require("../services/weatherService");

// for cron jobs
async function fetchHourlyWeather() {
    const cities = await WeatherCity.findAll({
        hourly_count: { [Op.gt]: 0 }
    });

    console.log(`Fetching hourly weather for ${cities.length} cities...`);

    for (const { city } of cities) {
        try {
            const data = await fetchWeather(city);
            await WeatherData.upsert({
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
    const cities = await WeatherCity.findAll({
        where: {
            daily_count: { [Op.gt]: 0 },
            hourly_count: 0
        }
    });

    console.log(`Fetching daily-only weather for ${cities.length} cities...`);

    for (const { city } of cities) {
        try {
            const data = await fetchWeather(city);
            await WeatherData.upsert({
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
