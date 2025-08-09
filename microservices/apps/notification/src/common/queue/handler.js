const config = require('../config/index').queue;
const events = require('./events');
const metricsKeys = require('../metrics/metricsKeys');

class EventHandler
{
    constructor(emailService, metricsProvider)
    {
        this.emailService = emailService;
        this.metricsProvider = metricsProvider;
    }

    async handleEvent(message)
    {
        try 
        {
            this.metricsProvider.incrementCounter(metricsKeys.QUEUE_JOBS_CONSUMED);
            const start = process.hrtime();
            console.log('this.email service:', this.emailService);
            const event = JSON.parse(message);

            let sub, emailRes;
            switch (event.type)
            {
                case events.USER_SUBSCRIBED:
                    sub = event.payload;
                    console.log('User subscribed:', sub);
                    emailRes = await this.emailService.sendConfirmationEmail(sub.email, sub.token);
                    if (!emailRes) console.error('Email service failed subscription flow');
                    break;

                case events.USER_UNSUBSCRIBED:
                    sub = event.payload;
                    console.log('User unsubscribed:', sub);
                    emailRes = await this.emailService.sendUnsubscribedEmail(sub.email, sub.city);
                    if (!emailRes) console.error('Email service failed unsubscribed flow');
                    break;

                case events.WEATHER_UPDATES_AVAILABLE: {
                    const payload = event.payload;
                    const { sent, failed } = await this.emailService.sendWeatherUpdates(payload);
                    console.log(`${sent} emails sent, ${failed} emails failed for ${payload.city}`);
                    break;
                }

                default:
                    console.warn('Unknown event type:', event.type);
            }
            const [seconds, nanoseconds] = process.hrtime(start);
            const duration = seconds + nanoseconds / 1e9;
            this.metricsProvider.observeHistogram(
                metricsKeys.QUEUE_CONSUMER_DURATION,
                duration, {
                    queue: config.queueName,
                    event_type: event.type
                }
            );
        }
        catch (err) 
        {
            console.error('Failed to parse message:', message, err);
        }
    }
}

module.exports = EventHandler;
