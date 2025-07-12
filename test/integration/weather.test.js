const request = require('supertest');
const { expect } = require('chai');

const app = require('../../src/app');

describe('GET /api/weather', () => {
    it('should return 400 if no city is provided', async () => {
        console.log('Running test: No city provided');
        const res = await request(app).get('/api/weather');
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('City is required');
    });

    it('should return weather data for a valid city', async () => {
        console.log('Running test: Valid city (Kyiv)');
        const res = await request(app).get('/api/weather?city=Kyiv');
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('temperature', 'humidity', 'description');
        expect(res.body.temperature).to.equal(22);
        expect(res.body.humidity).to.equal(60);
        expect(res.body.description).to.equal('Clear sky');
    });

    it('should return 404 for invalid city', async () => {
        console.log('Running test: Invalid city');
        const res = await request(app).get('/api/weather?city=INVALIDCITYNAME123');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('No matching location found.');
    });
});