const events = require("./events");

class EventHandler
{
    constructor(emailService)
    {
        this.emailService = emailService;
    }

    async handleEvent(message)
    {
        try {
            console.log('this.email service:', this.emailService);
            const event = JSON.parse(message);

            let sub, emailRes;
            switch (event.type) {
                case events.USER_SUBSCRIBED:
                    sub = event.payload
                    console.log('User subscribed:', sub);
                    emailRes = await this.emailService.sendConfirmationEmail(sub.email, sub.token);
                    if (!emailRes) console.error('Email service failed subscription flow');
                    break;

                case events.USER_UNSUBSCRIBED:
                    sub = event.payload
                    console.log('User unsubscribed:', sub);
                    emailRes = await this.emailService.sendUnsubscribedEmail(sub.email, sub.city);
                    if (!emailRes) console.error('Email service failed unsubscribed flow');
                    break;
                default:
                    console.warn('Unknown event type:', event.type);
            }
        } catch (err) {
            console.error('Failed to parse message:', message, err);
        }
    }
}

module.exports = EventHandler;
