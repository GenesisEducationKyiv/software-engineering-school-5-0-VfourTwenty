const {expect} = require("chai");

const WeatherUpdatesUseCase = require('../../../../src/use-cases/emails/weatherUpdatesUseCase');
const EmailServiceMock = require('../../../mocks/services/emailService.mock');
const WeatherServiceMock = require('../../../mocks/services/weatherService.mock');
const SubscriptionServiceMock = require('../../../mocks/services/subscriptionService.mock');

const emailServiceMock = new EmailServiceMock();
const weatherServiceMock = new WeatherServiceMock();
const subscriptionServiceMock = new SubscriptionServiceMock();

const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailServiceMock, weatherServiceMock, subscriptionServiceMock);

const Result = require('../../../../src/domain/types/result');

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

    it('should send weather updates to all valid subscribers', async () => {
        subscriptionServiceMock.stub(new Result(true, null, [sub1, sub2, sub3]));

        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        expect(sent).to.eq(3);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(0);
    });

    it('should not send weather updates if there is no weather data for chosen city', async () => {
        subscriptionServiceMock.stub(new Result(true, null, [
            {...sub1, city: 'NotRealCity'},
            {...sub2, city: 'ThisCityDoesntExist'},
            {...sub2, city: 'NotACityName'}
        ]))

        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        expect(sent).to.eq(0);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(3);
    });

    it('should not send weather updates to subscribers with invalid email addresses', async () => {
        subscriptionServiceMock.stub(new Result(true, null, [
            {...sub1, email:'shouldfail@mail.com'},
            {...sub2, email:'shouldfail@mail.com'},
            {...sub3, email:'shouldfail@mail.com'}
        ]))

        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        expect(sent).to.eq(0);
        expect(failed).to.eq(3);
        expect(skipped).to.eq(0);
    });

    it('should handle all cases properly and return correct counters for sent, failed, and skipped', async () => {
        subscriptionServiceMock.stub(new Result(true, null, [
            {...sub1, email:'shouldfail@mail.com'},
            sub3,
            {...sub2, city: 'ThisCityDoesntExist'},
            {...sub2, email:'shouldfail@mail.com'},
            sub1,
            {...sub2, city: 'NotACityName'},
            sub2
        ]))

        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        expect(sent).to.eq(3);
        expect(failed).to.eq(2);
        expect(skipped).to.eq(2);
    });
});