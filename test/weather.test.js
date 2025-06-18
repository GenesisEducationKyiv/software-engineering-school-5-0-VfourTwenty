const request = require('supertest');
const { expect } = require('chai');

const proxyquire = require('proxyquire');

// Load app with mocked service
const app = proxyquire('../src/app', {
    '../src/services/weatherService': require('./mocks/weatherService.mock'),
});

describe('GET /api/weather', () => {
    it('should return 400 if no city is provided', async () => {
        const res = await request(app).get('/api/weather');
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('City is required');
    });

    it('should return weather data for a valid city', async () => {
        const res = await request(app).get('/api/weather?city=Kyiv');
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('temperature', 'humidity', 'description');
    });

    it('should return 404 for invalid city', async () => {
        const res = await request(app).get('/api/weather?city=INVALIDCITYNAME123');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('No matching location found.');
    });
});
