const { WeatherCity, WeatherData } = require('../models');
const { Op } = require('sequelize');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// internal
async function fetchWeather(city) 
{
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text
    };
}

// for cron jobs
async function fetchHourlyWeather() 
{
    const cities = await WeatherCity.findAll({
        hourly_count: { [Op.gt]: 0 }
    });

    console.log(`Fetching hourly weather for ${cities.length} cities...`);

    for (const { city } of cities) 
    {
        try 
        {
            const data = await fetchWeather(city);
            await WeatherData.upsert({
                city,
                temperature: data.temperature,
                humidity: data.humidity,
                description: data.description,
                fetchedAt: new Date()
            });
            console.log(`✅ Cached hourly weather for ${city}`);
        }
        catch (err) 
        {
            console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
        }
    }
}

// reuse hourly fetches for cities that have both hourly and daily subs
async function fetchDailyWeather() 
{
    const cities = await WeatherCity.findAll({
        where: {
            daily_count: { [Op.gt]: 0 },
            hourly_count: 0
        }
    });

    console.log(`Fetching daily-only weather for ${cities.length} cities...`);

    for (const { city } of cities) 
    {
        try 
        {
            const data = await fetchWeather(city);
            await WeatherData.upsert({
                city,
                temperature: data.temperature,
                humidity: data.humidity,
                description: data.description,
                fetchedAt: new Date()
            });
            console.log(`✅ Cached daily-only weather for ${city}`);
        }
        catch (err) 
        {
            console.error(`❌ Failed to fetch weather for ${city}:`, err.message);
        }
    }
}

module.exports = {
    fetchHourlyWeather,
    fetchDailyWeather
};
