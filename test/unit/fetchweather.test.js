const { expect } = require('chai');

const { WeatherCity, WeatherData } = require('../mocks/models.mock');
const { fetchHourlyWeather, fetchDailyWeather } = require('../../src/utils/fetchweather');


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe('Fetch Weather Unit Tests', () => {
    beforeEach(() => {
        WeatherCity.data = {};
        WeatherData.data = {};
    });

    it('should fetch weather for all cities with hourly_count > 0', async () => {
        const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro'];
        for (const city of cities)
        {
            await WeatherCity.create({city: city, hourly_count: randomInt(0, 5), daily_count: randomInt(0, 5)});
        }
        await fetchHourlyWeather();
        for (const city of cities)
        {
            const data = await WeatherData.findByPk(city);
            const entry = await WeatherCity.findByPk(city);
            if (entry.hourly_count > 0)
            {
                expect(data).to.include.keys('city', 'temperature', 'humidity', 'description', 'fetchedAt');
                expect(data.temperature).to.equal(22);
                expect(data.humidity).to.equal(60);
                expect(data.description).to.equal('Clear sky');
            }
            else
            {
                expect(data).to.be.undefined;
            }
        }
    });

    it('should fetch weather for all cities with daily_count > 0 and hourly_count = 0', async () => {
        const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro'];
        for (const city of cities)
        {
            await WeatherCity.create({city: city, hourly_count: randomInt(0, 5), daily_count: randomInt(0, 5)});
        }
        await fetchDailyWeather();
        for (const city of cities)
        {
            const data = await WeatherData.findByPk(city);
            const entry = await WeatherCity.findByPk(city);
            if (entry.daily_count > 0 && entry.hourly_count === 0)
            {
                expect(data).to.include.keys('city', 'temperature', 'humidity', 'description', 'fetchedAt');
                expect(data.temperature).to.equal(22);
                expect(data.humidity).to.equal(60);
                expect(data.description).to.equal('Clear sky');
            }
            else
            {
                expect(data).to.be.undefined;
            }
        }
    });
});