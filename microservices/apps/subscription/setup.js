const QueuePublisher = require('./src/common/queue/rabbitMQ/RabbitMQPublisher');
const SubscriptionRepo = require('./src/infrastructure/db/repositories/sequelizeSubscriptionRepo');
const SubscriptionService = require('./src/application/subscriptionService');
const SubscriptionValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const config = require('./src/common/config/index').queue;
const queuePublisher = new QueuePublisher(config.queueUrl, config.queueName);

const subscriptionValidator = new SubscriptionValidator();
const subscriptionRepo = new SubscriptionRepo();
const subscriptionService = new SubscriptionService(subscriptionRepo, queuePublisher);
const subscriptionController = new SubscriptionController(subscriptionService, subscriptionValidator);

module.exports = {
    subscriptionController
}