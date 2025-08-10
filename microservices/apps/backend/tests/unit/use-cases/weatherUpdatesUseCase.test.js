const { expect } = require('chai');

const WeatherUpdatesUseCase = require('../../../src/application/use-cases/weatherUpdatesUseCase');
const QueuePublisherMock = require('../../mocks/queue/queuePublisher.mock');
const WeatherServiceMock = require('../../mocks/services/weatherService.mock');
const SubscriptionServiceMock = require('../../mocks/services/subscriptionService.mock');

const queuePublisherMock = new QueuePublisherMock();
const weatherServiceMock = new WeatherServiceMock();
const subscriptionServiceMock = new SubscriptionServiceMock();

const weatherUpdatesUseCase = new WeatherUpdatesUseCase(weatherServiceMock, subscriptionServiceMock, queuePublisherMock);

const Result = require('../../../src/common/utils/result');

const sub1 =
    {   email: 'valid@mail.com',
        city: 'Kyiv',
        frequency: 'hourly',
        confirmed: true
    };

const sub2 =
    {   email: 'valid@mail.com',
        city: 'Lviv',
        frequency: 'hourly',
        confirmed: true
    };

const sub3 =
    {   email: 'valid@mail.com',
        city: 'Odesa',
        frequency: 'hourly',
        confirmed: true
    };

describe('WeatherUpdatesUseCase Unit Tests', () => 
{
    it('should publish weather updates for all valid subscribers', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, [sub1, sub2, sub3]));

        // Act
        const { published, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        // Assert
        expect(published).to.eq(3);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(0);
    });

    it('should not publish weather updates if there is no weather data for chosen city', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, [
            { ...sub1, city: 'NotRealCity' },
            { ...sub2, city: 'ThisCityDoesntExist' },
            { ...sub2, city: 'NotACityName' }
        ]));

        // Act
        const { published, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        // Assert
        expect(published).to.eq(0);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(3);
    });

    it('should handle all cases properly and return correct counters for published, failed, and skipped', async () =>
    {
        // Arrange
        subscriptionServiceMock.stub(new Result(true, null, [
            { ...sub1, email:'shouldfail@mail.com' },
            sub3,
            { ...sub2, city: 'ThisCityDoesntExist' },
            { ...sub2, email:'shouldfail@mail.com' },
            sub1,
            { ...sub2, city: 'NotACityName' },
            sub2
        ]));

        // Act
        const { published, failed, skipped } = await weatherUpdatesUseCase.sendWeatherUpdates('hourly');

        // Assert
        expect(published).to.eq(5);
        expect(failed).to.eq(0);
        expect(skipped).to.eq(2);
    });
});
