const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const { Subscription, sequelize } = require('../models');

const sinon = require('sinon');
const mailer = require('../utils/mailer');

describe('POST /api/subscribe', () => 
{
    before(async () => 
    {
        await sequelize.sync();
        await Subscription.destroy({ where: {} }); // clear table
    });

    // missing email
    it('should return 400 for missing email', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ city: 'Kyiv', frequency: 'daily' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields');
    });

    // missing city
    it('should return 400 for missing city', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'test@gmail.com', frequency: 'daily' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields');
    });

    // missing frequency
    it('should return 400 for missing frequency', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'test@gmail.com', city: 'Kyiv' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields');
    });

    // invalid email format
    it('should return 400 for invalid email format', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'invalid_email', city: 'Kyiv', frequency: 'daily' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid email format');
    });

    // frequency != daily or hourly
    it('should return 400 for invalid frequency string', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'test@gmail.com', city: 'Kyiv', frequency: 'hgkdfhgsh' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid frequency');
    });

    // successful subscription
    it('should return 200 and create a subscription', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'delivered@resend.dev', city: 'Kyiv', frequency: 'daily' });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Subscription successful. Confirmation email sent.');

        const sub = await Subscription.findOne({
            where: { email: 'delivered@resend.dev', city: 'Kyiv', frequency: 'daily' }
        });
        expect(sub).to.exist;
        expect(sub.confirmed).to.be.false;
        expect(sub.token).to.be.a('string');
    });

    // duplicate subscription
    it('should return 409 for duplicate subscription', async () => 
    {
        await Subscription.create({
            email: 'test@example.com',
            city: 'Kyiv',
            frequency: 'daily',
            confirmed: false,
            token: 'some-token'
        });

        const res = await request(app)
            .post('/api/subscribe')
            .type('form')
            .send({ email: 'test@example.com', city: 'Kyiv', frequency: 'daily' });

        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal('Email already subscribed for this city and frequency');
    });
});

describe('GET /api/confirm/:token', () => 
{
    let token;

    before(async () => 
    {
        await sequelize.sync();

        const sub = await Subscription.create({
            email: 'confirm@test.com',
            city: 'Kyiv',
            frequency: 'daily',
            confirmed: false,
            token: 'valid-confirm-token'
        });

        token = sub.token;
    });

    // confirmation successful
    it('should return 200 and confirm subscription', async () => 
    {
        const res = await request(app).get(`/api/confirm/${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Subscription confirmed successfully');

        const sub = await Subscription.findOne({ where: { token } });
        expect(sub.confirmed).to.be.true;
    });

    // already confirmed
    it('should return 400 if already confirmed', async () => 
    {
        const res = await request(app).get(`/api/confirm/${token}`);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Subscription already confirmed');
    });

    // token doesn't exist
    it('should return 404 if token not found', async () => 
    {
        const res = await request(app).get('/api/confirm/this-token-does-not-exist');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Token not found');
    });

    // token too short
    it('should return 400 for invalid token format', async () => 
    {
        const res = await request(app).get('/api/confirm/123');
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid token');
    });
});

describe('GET /api/unsubscribe/:token', () => 
{
    let token;

    before(async () => 
    {
        await sequelize.sync();

        const sub = await Subscription.create({
            // resend test recipient
            email: 'delivered@resend.dev',
            city: 'Odesa',
            frequency: 'daily',
            confirmed: true,
            token: 'valid-unsub-token'
        });

        token = sub.token;
    });

    it('should return 200 and delete the subscription', async () => 
    {
        // 💡 Place the stub BEFORE making the request
        sinon.stub(mailer, 'sendUnsubscribeEmail').resolves(true);

        // Send unsubscribe request
        const res = await request(app).get(`/api/unsubscribe/${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Unsubscribed successfully');

        // Confirm it's deleted
        const check = await Subscription.findOne({ where: { token } });
        expect(check).to.be.null;

        // Clean up the stub AFTER the test
        sinon.restore();
    });

    it('should return 404 if token not found', async () => 
    {
        const res = await request(app).get('/api/unsubscribe/not-a-real-token');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Token not found');
    });

    it('should return 400 for invalid token format', async () => 
    {
        const res = await request(app).get('/api/unsubscribe/123');
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid token');
    });
});
