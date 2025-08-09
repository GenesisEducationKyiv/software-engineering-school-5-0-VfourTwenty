const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('EmailChannel', () => 
{
    let EmailChannel, fetchStub, buildConfirmEmail, buildUnsubscribedEmail, buildWeatherUpdateEmail;
    let configStub;
    const emailUrl = 'http://mocked-email-service';
    const frontendUrl = 'http://mocked-frontend';

    beforeEach(() => 
    {
        fetchStub = sinon.stub();
        buildConfirmEmail = sinon.stub().returns('<html>confirm</html>');
        buildUnsubscribedEmail = sinon.stub().returns('<html>unsub</html>');
        buildWeatherUpdateEmail = sinon.stub().returns('<html>weather</html>');
        configStub = { emailUrl, frontendUrl };

        EmailChannel = proxyquire('../../src/application/emailChannel', {
            '../common/config': configStub,
            '../common/utils/emailTemplates': {
                buildConfirmEmail,
                buildUnsubscribedEmail,
                buildWeatherUpdateEmail
            },
        });
        global.fetch = fetchStub;
    });

    afterEach(() => 
    {
        sinon.restore();
        delete global.fetch;
    });

    it('should send confirmation email successfully', async () => 
    {
        const channel = new EmailChannel();
        fetchStub.resolves({ status: 200, json: async () => ({ ok: true }) });
        const result = await channel.sendConfirmationEmail('to@example.com', 'token123');
        expect(result).to.be.true;
        expect(buildConfirmEmail.calledOnceWith('token123')).to.be.true;
        expect(fetchStub.calledOnce).to.be.true;
    });

    it('should handle failure in confirmation email', async () => 
    {
        const channel = new EmailChannel();
        fetchStub.resolves({ status: 500, json: async () => ({ ok: false }) });
        const result = await channel.sendConfirmationEmail('to@example.com', 'token123');
        expect(result).to.be.false;
    });

    it('should send unsubscribed email successfully', async () => 
    {
        const channel = new EmailChannel();
        fetchStub.resolves({ status: 200, json: async () => ({ ok: true }) });
        const result = await channel.sendUnsubscribedEmail('to@example.com', 'Kyiv');
        expect(result).to.be.true;
        expect(buildUnsubscribedEmail.calledOnceWith('Kyiv')).to.be.true;
        expect(fetchStub.calledOnce).to.be.true;
    });

    it('should handle failure in unsubscribed email', async () => 
    {
        const channel = new EmailChannel();
        fetchStub.resolves({ status: 500, json: async () => ({ ok: false }) });
        const result = await channel.sendUnsubscribedEmail('to@example.com', 'Kyiv');
        expect(result).to.be.false;
    });

    it('should send weather updates to all subscribers and count sent/failed', async () => 
    {
        const channel = new EmailChannel();
        // Simulate 2 subscribers: one success, one fail
        fetchStub.onFirstCall().resolves({ status: 200, json: async () => ({ ok: true }) });
        fetchStub.onSecondCall().resolves({ status: 500, json: async () => ({ ok: false }) });
        const payload = {
            city: 'Kyiv',
            weather: { temperature: 10, humidity: 50, description: 'Sunny' },
            subscribers: [
                { email: 'a@example.com', token: 'tokA' },
                { email: 'b@example.com', token: 'tokB' }
            ]
        };
        const result = await channel.sendWeatherUpdates(payload);
        expect(result.sent).to.equal(1);
        expect(result.failed).to.equal(1);
        expect(buildWeatherUpdateEmail.calledTwice).to.be.true;
        expect(fetchStub.calledTwice).to.be.true;
    });

    it('should handle fetch throwing error', async () => 
    {
        const channel = new EmailChannel();
        fetchStub.rejects(new Error('network error'));
        const result = await channel.sendConfirmationEmail('to@example.com', 'token123');
        expect(result).to.be.false;
    });
});
