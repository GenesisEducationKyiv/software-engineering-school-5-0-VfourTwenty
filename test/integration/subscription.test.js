const request = require('supertest');
const { expect } = require('chai');
const express = require('express');

const redisClient = require('../../src/utils/redisClient');
const SimpleCounter = require('../mocks/utils/metrics.mock');

const SubscriptionRepo = require('../../src/repositories/sequelizeSubscriptionRepo');
const SubscriptionApiController = require('../../src/controllers/subscriptionApiController');
const SubscriptionService = require('../../src/services/subscriptionService');
const EmailService = require('../../src/services/emailService');
const WeatherServiceWithCacheAndMetrics = require('../../src/services/weatherService');

const SubscribeUserUseCase = require('../../src/use-cases/subscription/subscribeUserUseCase');
const ConfirmSubscriptionUseCase = require('../../src/use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('../../src/use-cases/subscription/unsubscribeUserUseCase');

const SubscriptionValidator = require('../../src/domain/validators/subscriptionValidator');
const CityValidator = require('../../src/domain/validators/cityValidator');
const EmailProviderManagerMock = require('../mocks/providers/emailProviderManager.mock');
const WeatherProviderManagerMock = require('../mocks/providers/weatherProviderManager.mock');

const subscriptionRepo = new SubscriptionRepo();
const emailProviderManagerMock = new EmailProviderManagerMock();
const weatherProviderManagerMock = new WeatherProviderManagerMock();

const weatherService = new WeatherServiceWithCacheAndMetrics(
    weatherProviderManagerMock, redisClient, new SimpleCounter(), new SimpleCounter());
const emailService = new EmailService(emailProviderManagerMock);

const cityValidator = new CityValidator(weatherService);
const subscriptionValidator = new SubscriptionValidator(cityValidator);

const subscriptionService = new SubscriptionService(subscriptionRepo);

const subscribeUserUseCase = new SubscribeUserUseCase(subscriptionValidator, subscriptionService, emailService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService, emailService);

const subscriptionApiController = new SubscriptionApiController(subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);

const app = express();
app.use(express.json());

app.post('/api/subscribe', subscriptionApiController.subscribe);
app.get('/api/confirm/:token', subscriptionApiController.confirm);
app.get('/api/unsubscribe/:token', subscriptionApiController.unsubscribe);

const validSub = {
    email: 'valid@mail.com',
    city: 'Kyiv',
    frequency: 'hourly'
};

describe('POST /api/subscribe', () => 
{
    beforeEach(async () => 
    {
        await subscriptionRepo.clear();
    });

    // missing email
    it('should return 400 for missing email', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ city: validSub.city, frequency: validSub.frequency });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields.');
    });

    // missing city
    it('should return 400 for missing city', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ email: validSub.email, frequency: validSub.frequency });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields.');
    });

    // missing frequency
    it('should return 400 for missing frequency', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ email: validSub.email, city: validSub.city });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Missing required fields.');
    });

    // invalid email format
    it('should return 400 for invalid email format', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ email: 'invalid_email', city: validSub.city, frequency: validSub.frequency });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid email format.');
    });

    it('should return 400 for invalid city', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ email: validSub.email, city: 'UnknownCity', frequency: validSub.frequency });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid city.');
    });

    // frequency != daily or hourly
    it('should return 400 for invalid frequency string', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send({ email: validSub.email, city: validSub.city, frequency: 'hgkdfhgsh' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Invalid frequency.');
    });

    // successful subscription
    it('should return 200 and create a subscription', async () => 
    {
        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send(validSub);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Subscription successful. Confirmation email sent.');

        const result = await subscriptionRepo.findSub(validSub);
        const sub = result.data;
        expect(sub).to.exist;
        expect(sub.confirmed).to.be.false;
        expect(sub.token).to.be.a('string');
    });

    // duplicate subscription
    it('should return 409 for duplicate subscription', async () => 
    {
        await subscriptionRepo.createSub(validSub);

        const res = await request(app)
            .post('/api/subscribe')
            .type('json')
            .send(validSub);

        expect(res.status).to.equal(409);
        expect(res.body.error).to.equal('Subscription already exists for this city and frequency.');
    });
});

describe('GET /api/confirm/:token', () => 
{
    let token;

    beforeEach(async () => 
    {
        await subscriptionRepo.clear();
        token = 'token_confirm';
        await subscriptionRepo.createSub({ ...validSub, confirmed: false, token: token });
    });

    // confirmation successful
    it('should return 200 and confirm subscription', async () => 
    {
        const res = await request(app).get(`/api/confirm/${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Subscription confirmed successfully');

        const result = await subscriptionRepo.findSub({ token: token });
        const sub = result.data;
        expect(sub.confirmed).to.be.true;
    });

    // already confirmed
    it('should return 400 if already confirmed', async () => 
    {
        await subscriptionRepo.confirmSub(token);
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

    beforeEach(async () => 
    {
        await subscriptionRepo.clear();
        token = 'token_unsub';
        await subscriptionRepo.createSub({ ...validSub, confirmed: true, token: token });
    });

    it('should return 200 and delete the subscription', async () => 
    {
        const res = await request(app).get(`/api/unsubscribe/${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Unsubscribed successfully');

        const check = await subscriptionRepo.findSub({ token: token });
        expect(check.success).to.be.false;
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

    it('should return 400 when trying to reuse the token for unsubscribe', async () => 
    {
        await subscriptionService.unsubscribeUser(token);
        const res = await request(app).get(`/api/unsubscribe/${token}`);
        expect(res.status).to.equal(404);
        // token had been deleted
        expect(res.body.error).to.equal('Token not found');
    });
});
