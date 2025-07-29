const {expect} = require("chai");
const sinon = require('sinon');

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
    let logSpy, warnSpy, errorSpy;
    beforeEach(async () => {
        logSpy = sinon.spy(console, 'log');
        warnSpy = sinon.spy(console, 'warn');
        errorSpy = sinon.spy(console, 'error');
    });

    afterEach(async () => {
        logSpy.restore();
        warnSpy.restore();
        errorSpy.restore();
    });

    it('should send weather updates to all valid subscribers', async () => {
        subscriptionServiceMock.stub(new Result(true, null, [sub1, sub2, sub3]));

        const { sent, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        sinon.assert.callCount(logSpy, 6);
        sinon.assert.callCount(warnSpy, 0);
        sinon.assert.callCount(errorSpy, 0);

        sinon.assert.calledWithExactly(logSpy.getCall(0), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(1), '✅ hourly email sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(2), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(3), '✅ hourly email sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(4), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(5), '✅ hourly email sent to valid@mail.com');

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

        sinon.assert.callCount(logSpy, 0);
        sinon.assert.callCount(warnSpy, 3);
        sinon.assert.callCount(errorSpy, 0);

        sinon.assert.calledWithExactly(warnSpy.getCall(0), '⚠️ No weather data available for NotRealCity, skipping valid@mail.com, error: NO WEATHER DATA');
        sinon.assert.calledWithExactly(warnSpy.getCall(1), '⚠️ No weather data available for ThisCityDoesntExist, skipping valid@mail.com, error: NO WEATHER DATA');
        sinon.assert.calledWithExactly(warnSpy.getCall(2), '⚠️ No weather data available for NotACityName, skipping valid@mail.com, error: NO WEATHER DATA');

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

        sinon.assert.callCount(logSpy, 0);
        sinon.assert.callCount(warnSpy, 0);
        sinon.assert.callCount(errorSpy, 3);

        sinon.assert.calledWithExactly(errorSpy.getCall(0), '❌ Email send failed for shouldfail@mail.com');
        sinon.assert.calledWithExactly(errorSpy.getCall(1), '❌ Email send failed for shouldfail@mail.com');
        sinon.assert.calledWithExactly(errorSpy.getCall(2), '❌ Email send failed for shouldfail@mail.com');


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

        sinon.assert.callCount(logSpy, 6);
        sinon.assert.callCount(warnSpy, 2);
        sinon.assert.callCount(errorSpy, 2);

        sinon.assert.calledWithExactly(logSpy.getCall(0), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(1), '✅ hourly email sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(2), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(3), '✅ hourly email sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(4), '📧 Weather update sent to valid@mail.com');
        sinon.assert.calledWithExactly(logSpy.getCall(5), '✅ hourly email sent to valid@mail.com');

        sinon.assert.calledWithExactly(errorSpy.getCall(0), '❌ Email send failed for shouldfail@mail.com');
        sinon.assert.calledWithExactly(errorSpy.getCall(1), '❌ Email send failed for shouldfail@mail.com');

        sinon.assert.calledWithExactly(warnSpy.getCall(0), '⚠️ No weather data available for ThisCityDoesntExist, skipping valid@mail.com, error: NO WEATHER DATA');
        sinon.assert.calledWithExactly(warnSpy.getCall(1), '⚠️ No weather data available for NotACityName, skipping valid@mail.com, error: NO WEATHER DATA');

        expect(sent).to.eq(3);
        expect(failed).to.eq(2);
        expect(skipped).to.eq(2);
    });
});