const { expect } = require('chai');
const sinon = require('sinon');
const EventHandler = require('../../src/common/queue/handler');
const events = require('../../src/common/queue/events');

describe('EventHandler.handleEvent', () =>
{
    let emailServiceMock, loggerStub, loggerInstanceStub, metricsProviderStub, handler;

    beforeEach(() =>
    {
        // Email service mock
        emailServiceMock = {
            sendConfirmationEmail: sinon.stub(),
            sendUnsubscribedEmail: sinon.stub(),
            sendWeatherUpdates: sinon.stub()
        };

        // Logger stub
        loggerInstanceStub = {
            debug: sinon.stub(),
            info: sinon.stub(),
            warn: sinon.stub(),
            error: sinon.stub(),
        };
        loggerStub = {
            for: sinon.stub().returns(loggerInstanceStub),
        };

        // Metrics provider stub
        metricsProviderStub = {
            incrementCounter: sinon.stub(),
            observeHistogram: sinon.stub(),
        };

        // Pass all three to EventHandler
        handler = new EventHandler(emailServiceMock, loggerStub, metricsProviderStub);
    });

    it('should call sendConfirmationEmail for USER_SUBSCRIBED', async () =>
    {
        const msg = JSON.stringify({
            type: events.USER_SUBSCRIBED,
            payload: { email: 'test@example.com', token: 'abc123' }
        });
        emailServiceMock.sendConfirmationEmail.resolves(true);
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendConfirmationEmail.calledOnceWith('test@example.com', 'abc123')).to.be.true;
    });

    it('should call sendUnsubscribedEmail for USER_UNSUBSCRIBED', async () =>
    {
        const msg = JSON.stringify({
            type: events.USER_UNSUBSCRIBED,
            payload: { email: 'test@example.com', city: 'Kyiv' }
        });
        emailServiceMock.sendUnsubscribedEmail.resolves(true);
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendUnsubscribedEmail.calledOnceWith('test@example.com', 'Kyiv')).to.be.true;
    });

    it('should call sendWeatherUpdates for WEATHER_UPDATES_AVAILABLE', async () =>
    {
        const payload = { city: 'Kyiv', weather: {}, subscribers: [] };
        const msg = JSON.stringify({
            type: events.WEATHER_UPDATES_AVAILABLE,
            payload
        });
        emailServiceMock.sendWeatherUpdates.resolves({ sent: 1, failed: 0 });
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendWeatherUpdates.calledOnceWith(payload)).to.be.true;
    });

    it('should warn on unknown event type', async () =>
    {
        const msg = JSON.stringify({ type: 'UNKNOWN_EVENT', payload: {} });
        await handler.handleEvent(msg);
        expect(loggerInstanceStub.warn.calledOnce).to.be.true;
    });

    it('should handle malformed JSON', async () =>
    {
        await handler.handleEvent('not a json');
        expect(loggerInstanceStub.error.called).to.be.true;
    });
});
