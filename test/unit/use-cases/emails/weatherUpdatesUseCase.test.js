const WeatherUpdatesUseCase = require('../../../../src/domain/use-cases/emails/weatherUpdatesUseCase');

const EmailServiceMock = require('../../../mocks/services/emailService.mock');
const WeatherServiceMock = require('../../../mocks/services/weatherService.mock');
const SubscriptionRepoMock = require('../../../mocks/repositories/subscriptionRepo.mock');
const {expect} = require("chai");

const emailServiceMock = new EmailServiceMock();
const weatherServiceMock = new WeatherServiceMock();
const subscriptionRepoMock = new SubscriptionRepoMock();

const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailServiceMock, weatherServiceMock, subscriptionRepoMock);

const sub1 =
    {   email: 'valid@mail.com',
        city: 'Kyiv',
        frequency: 'hourly',
        confirmed: true
    }

const sub2 =
    {   email: 'valid@mail.com',
        city: 'Lviv',
        frequency: 'hourly',
        confirmed: true
    }

const sub3 =
    {   email: 'valid@mail.com',
        city: 'Odesa',
        frequency: 'hourly',
        confirmed: true
    }

describe('WeatherUpdatesUseCase Unit Tests', () => {
    beforeEach(async () => {
        await subscriptionRepoMock.clear();
    });

    it('should send weather updates to all valid subscribers', async () => {
        await subscriptionRepoMock.createSub(sub1);
        await subscriptionRepoMock.createSub(sub2);
        await subscriptionRepoMock.createSub(sub3);
        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');
        expect(sent).to.eq(3);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(0);
    });

    it('should not send weather updates if there is no weather data for chosen city', async () => {
        await subscriptionRepoMock.createSub({...sub1, city: 'NotRealCity'});
        await subscriptionRepoMock.createSub({...sub2, city: 'ThisCityDoesntExist'});
        await subscriptionRepoMock.createSub({...sub2, city: 'NotACityName'});
        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');
        expect(sent).to.eq(0);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(3);
    });

    it('should not send weather updates to subscribers with invalid email addresses', async () => {
        await subscriptionRepoMock.createSub({...sub1, email:'shouldfail@mail.com'});
        await subscriptionRepoMock.createSub({...sub2, email:'shouldfail@mail.com'});
        await subscriptionRepoMock.createSub({...sub2, email:'shouldfail@mail.com'});
        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');
        expect(sent).to.eq(0);
        expect(failed).to.eq(3);
        expect(skipped).to.eq(0);
    });
});