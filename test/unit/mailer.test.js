const { expect } = require('chai');

const { Subscription, WeatherData } = require('../mocks/models.mock');
const { sendConfirmationEmail, sendUnsubscribeEmail, sendUpdates } = require('../../src/utils/mailer');


function randomEmail()
{
    return Math.random() < 0.5 ? 'valid@mail.com' : 'thisemailshouldfail@mail.com';
}

describe('Mailer Unit Tests', () => {
    beforeEach(() => {
        Subscription.data = [];
        WeatherData.data = {};
    });

    it('should send a confirmation email to a valid address and return true', async () => {
        const success = await sendConfirmationEmail('valid@mail.com', 'link');
        expect(success).to.be.true;
    });

    it('should not send a confirmation email to an invalid address and should return false', async () => {
        const success = await sendConfirmationEmail('thisemailshouldfail@mail.com', 'link');
        expect(success).to.be.false;
    });

    it('should send an unsubscribe email to a valid address and return true', async () => {
        const success = await sendUnsubscribeEmail('valid@mail.com', 'link');
        expect(success).to.be.true;
    });

    it('should not send an unsubscribe email to an invalid address and should return false', async () => {
        const success = await sendUnsubscribeEmail('thisemailshouldfail@mail.com', 'link');
        expect(success).to.be.false;
    });

    it('should send hourly updates to all valid subscribers', async () => {
        const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro'];
        let sent   = 0;
        let failed = 0;
        let skipped = 0;
        for (const city of cities)
        {
            const sub = await Subscription.create({email: randomEmail(), city: city, frequency: 'hourly', confirmed: true})
            if (Math.random() < 0.5)
            {
                WeatherData.data[city] = new WeatherData({city: city, temperature: 22, humidity: 60, description: 'Clear sky'});
            } else {skipped ++; continue} // skip if no weather is cached for a city
            if (sub.email === 'thisemailshouldfail@mail.com') {failed ++}
            else {sent ++}
        }
        const result = await sendUpdates('hourly');

        expect(result).to.include.keys('sent', 'failed', 'skipped');
        expect(result.sent + result.failed + result.skipped).to.equal(cities.length, "total mismatch");
        expect(result.sent).to.equal(sent, 'wrong number of sent emails');
        expect(result.skipped).to.equal(skipped, 'wrong number of skipped emails');
        expect(result.failed).to.equal(failed, 'wrong number of failed emails');
    });

    it('should send daily updates to all valid subscribers', async () => {
        const cities = ['Kyiv', 'Lviv', 'Odesa', 'Dnipro'];
        let sent   = 0;
        let failed = 0;
        let skipped = 0;
        for (const city of cities)
        {
            const sub = await Subscription.create({email: randomEmail(), city: city, frequency: 'daily', confirmed: true})
            if (Math.random() < 0.5)
            {
                WeatherData.data[city] = new WeatherData({city: city, temperature: 22, humidity: 60, description: 'Clear sky'});
            } else {skipped ++; continue}
            if (sub.email === 'thisemailshouldfail@mail.com') {failed ++}
            else {sent ++}
        }
        const result = await sendUpdates('daily');

        expect(result).to.include.keys('sent', 'failed', 'skipped');
        expect(result.sent + result.failed + result.skipped).to.equal(cities.length, "total mismatch");
        expect(result.sent).to.equal(sent, 'wrong number of sent emails');
        expect(result.skipped).to.equal(skipped, 'wrong number of skipped emails');
        expect(result.failed).to.equal(failed, 'wrong number of failed emails');
    });
});

