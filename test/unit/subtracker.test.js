const { expect } = require('chai');

const { incrementCityCounter, decrementCityCounter } = require('../../src/utils/subtracker')
const { WeatherCity } = require('../mocks/models.mock');

describe('Sub Tracker Unit Tests', () => {
    beforeEach(() => {
        WeatherCity.data = {};
    });

    it('should create a new city entry with daily count = 1', async () => {
        await incrementCityCounter('Kyiv', 'daily');
        const entry = await WeatherCity.findByPk('Kyiv');
        console.log(entry);
        expect(entry.daily_count).to.equal(1);
    });

    it('should create a new city entry with hourly count = 1', async () => {
        await incrementCityCounter('Lviv', 'daily');
        const entry = await WeatherCity.findByPk('Lviv');
        console.log(entry);
        expect(entry.daily_count).to.equal(1);
    });

    it('should increment hourly count if city exists', async () => {
        await WeatherCity.create({ city: 'Kyiv', daily_count: 0, hourly_count: 1 });
        await incrementCityCounter('Kyiv', 'hourly');
        const entry = await WeatherCity.findByPk('Kyiv');
        expect(entry.hourly_count).to.equal(2);
    });

    it('should increment daily count if city exists', async () => {
        await WeatherCity.create({ city: 'Lviv', daily_count: 1, hourly_count: 0 });
        await incrementCityCounter('Lviv', 'daily');
        const entry = await WeatherCity.findByPk('Lviv');
        expect(entry.daily_count).to.equal(2);
    });

    it('should decrement hourly count for a city', async () => {
        await WeatherCity.create({ city: 'Dnipro', daily_count: 2, hourly_count: 1 });
        await decrementCityCounter('Dnipro', 'hourly');
        const entry = await WeatherCity.findByPk('Dnipro');
        expect(entry.daily_count).to.equal(2);
        expect(entry.hourly_count).to.equal(0);
    });

    it('should decrement daily count for a city', async () => {
        await WeatherCity.create({ city: 'Dnipro', daily_count: 2, hourly_count: 1 });
        await decrementCityCounter('Dnipro', 'daily');
        const entry = await WeatherCity.findByPk('Dnipro');
        expect(entry.daily_count).to.equal(1);
        expect(entry.hourly_count).to.equal(1);
    });

    it('should decrement hourly count and delete city if both counts reach 0', async () => {
        await WeatherCity.create({ city: 'Odesa', daily_count: 0, hourly_count: 1 });
        await decrementCityCounter('Odesa', 'hourly');
        const entry = await WeatherCity.findByPk('Odesa');
        expect(entry).to.be.undefined;
    });

    it('should decrement daily count and delete city if both counts reach 0', async () => {
        await WeatherCity.create({ city: 'Odesa', daily_count: 1, hourly_count: 0 });
        await decrementCityCounter('Odesa', 'daily');
        const entry = await WeatherCity.findByPk('Odesa');
        expect(entry).to.be.undefined;
    });

    it('should do nothing if city is not found', async () => {
        let threw = false;
        try {
            await decrementCityCounter('FakeCity', 'daily');
        } catch (err) {
            threw = true;
        }
        expect(threw).to.be.false;
    });
});