const { expect } = require('chai');
const sinon = require('sinon');
const EventHandler = require('../../src/common/queue/handler');
const events = require('../../src/common/queue/events');

describe('EventHandler.handleEvent', () => {
    let emailServiceMock, handler;

    beforeEach(() => {
        emailServiceMock = {
            sendConfirmationEmail: sinon.stub(),
            sendUnsubscribedEmail: sinon.stub(),
            sendWeatherUpdates: sinon.stub()
        };
        handler = new EventHandler(emailServiceMock);
    });

    it('should call sendConfirmationEmail for USER_SUBSCRIBED', async () => {
        const msg = JSON.stringify({
            type: events.USER_SUBSCRIBED,
            payload: { email: 'test@example.com', token: 'abc123' }
        });
        emailServiceMock.sendConfirmationEmail.resolves(true);
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendConfirmationEmail.calledOnceWith('test@example.com', 'abc123')).to.be.true;
    });

    it('should call sendUnsubscribedEmail for USER_UNSUBSCRIBED', async () => {
        const msg = JSON.stringify({
            type: events.USER_UNSUBSCRIBED,
            payload: { email: 'test@example.com', city: 'Kyiv' }
        });
        emailServiceMock.sendUnsubscribedEmail.resolves(true);
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendUnsubscribedEmail.calledOnceWith('tests@example.com', 'Kyiv')).to.be.true;
    });

    it('should call sendWeatherUpdates for WEATHER_UPDATES_AVAILABLE', async () => {
        const payload = { city: 'Kyiv', weather: {}, subscribers: [] };
        const msg = JSON.stringify({
            type: events.WEATHER_UPDATES_AVAILABLE,
            payload
        });
        emailServiceMock.sendWeatherUpdates.resolves({ sent: 1, failed: 0 });
        await handler.handleEvent(msg);
        expect(emailServiceMock.sendWeatherUpdates.calledOnceWith(payload)).to.be.true;
    });

    it('should warn on unknown event type', async () => {
        const msg = JSON.stringify({ type: 'UNKNOWN_EVENT', payload: {} });
        const warnStub = sinon.stub(console, 'warn');
        await handler.handleEvent(msg);
        expect(warnStub.calledOnce).to.be.true;
        warnStub.restore();
    });

    it('should handle malformed JSON', async () => {
        const errorStub = sinon.stub(console, 'error');
        await handler.handleEvent('not a json');
        expect(errorStub.called).to.be.true;
        errorStub.restore();
    });
});
