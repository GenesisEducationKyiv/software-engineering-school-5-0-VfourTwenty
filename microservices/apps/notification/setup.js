const QueueConsumer = require('./src/common/queue/rabbitMQ/RabbitMQConsumer');
const EmailChannel = require('./src/application/emailChannel');
const EventHandler = require('./src/common/queue/handler');

const metricsProvider = require('./src/common/metrics/metricsSetup');
const config = require('./src/common/config/index').queue;
const queueConsumer = new QueueConsumer(config.queueUrl);
const emailChannel = new EmailChannel(metricsProvider);
const eventHandler = new EventHandler(emailChannel, metricsProvider);

module.exports = {
    eventHandler,
    queueConsumer
};
