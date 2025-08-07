const QueuePublisher = require('./src/common/queue/rabbitMQ/RabbitMQPublisher');
const SubscriptionRepo = require('./src/infrastructure/db/repositories/sequelizeSubscriptionRepo');
const SubscriptionService = require('./src/application/subscriptionService');
const SubscriptionValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const queuePublisher = new QueuePublisher('amqp://rabbitmq:5672', 'test_queue');
const subscriptionValidator = new SubscriptionValidator();
const subscriptionRepo = new SubscriptionRepo();
const subscriptionService = new SubscriptionService(subscriptionRepo, queuePublisher);
const subscriptionController = new SubscriptionController(subscriptionService, subscriptionValidator);

module.exports = {
    subscriptionController
}