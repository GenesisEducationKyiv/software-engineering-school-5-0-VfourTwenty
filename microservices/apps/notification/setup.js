const QueueConsumer = require('./src/queue/rabbitMQ/RabbitMQConsumer');
const EmailChannel = require('./src/application/emailChannel');
const EventHandler = require('./src/queue/handler');

const config = require('./src/common/config/index').queue;
const queueConsumer = new QueueConsumer(config.queueUrl);
const emailChannel = new EmailChannel();
const eventHandler = new EventHandler(emailChannel);

module.exports = {
    eventHandler,
    queueConsumer
}