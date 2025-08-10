const config = require('../config/index').queue;
const events = require('./events');
const metricsKeys = require('../metrics/metricsKeys');

class EventHandler
{
    constructor(emailService, logger, metricsProvider)
    {
        this.emailService = emailService;
        this.log = logger.for('NotificationQueueEventHandler');
        this.metricsProvider = metricsProvider;
    }

    async handleEvent(message)
    {
        try 
        {
            this.metricsProvider.incrementCounter(metricsKeys.QUEUE_JOBS_CONSUMED);
            const start = process.hrtime();
            const event = JSON.parse(message);
            this.log.info('Processing incoming event', event);

            let sub, emailRes;
            switch (event.type)
            {
                case events.USER_SUBSCRIBED:
                    sub = event.payload;
                    this.log.debug('UserSubscribed event consumed', sub);
                    emailRes = await this.emailService.sendConfirmationEmail(sub.email, sub.token);
                    if (!emailRes)
                    {
                        this.log.error('Email service failed in subscription flow');
                    }
                    break;

                case events.USER_UNSUBSCRIBED:
                    sub = event.payload;
                    this.log.debug('User unsubscribed', sub);
                    emailRes = await this.emailService.sendUnsubscribedEmail(sub.email, sub.city);
                    if (!emailRes)
                    {
                        this.log.error('Email service failed in unsubscribed flow');
                    }
                    break;

                case events.WEATHER_UPDATES_AVAILABLE: {
                    const payload = event.payload;
                    const { sent, failed } = await this.emailService.sendWeatherUpdates(payload);
                    this.log.info(`${sent} emails sent, ${failed} emails failed for ${payload.city}`);
                    break;
                }

                default:
                    this.log.warn('Unknown event type:', event.type);
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
            this.log.error('Failed to parse message:', { message, err });
        }
    }
}

module.exports = EventHandler;
