const EmailService = require('./src/application/emailService');
const EventHandler = require('./src/queue/handler');

const emailService = new EmailService();
const eventHandler = new EventHandler(emailService);

module.exports = {
    eventHandler
}