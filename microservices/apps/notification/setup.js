const Logger = require('./src/common/utils/logger');
const QueueConsumer = require('./src/common/queue/rabbitMQ/RabbitMQConsumer');
const EmailChannel = require('./src/application/emailChannel');
const EventHandler = require('./src/common/queue/handler');

const config = require('./src/common/config');
const logger = new Logger(config.logger);
const metricsProvider = require('./src/common/metrics/metricsSetup');
const queueConsumer = new QueueConsumer(config.queue.queueUrl);
const emailChannel = new EmailChannel(logger, metricsProvider);
const eventHandler = new EventHandler(emailChannel, logger, metricsProvider);

module.exports = {
    eventHandler,
    queueConsumer
};
