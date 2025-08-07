const QueueConsumer = require('./src/queue/rabbitMQ/RabbitMQConsumer');
const EmailChannel = require('./src/application/emailChannel');
const EventHandler = require('./src/queue/handler');

const queueConsumer = new QueueConsumer('amqp://rabbitmq:5672');
const emailChannel = new EmailChannel();
const eventHandler = new EventHandler(emailChannel);

module.exports = {
    eventHandler,
    queueConsumer
}