const Logger = require('./src/common/utils/logger');
const SubscriptionRepo = require('./src/infrastructure/db/repositories/sequelizeSubscriptionRepo');
const SubscriptionService = require('./src/application/subscriptionService');
const SubscriptionValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const config = require('./src/common/config/index').logger;
const logger = new Logger(config);
const metricsProvider = require('./src/common/metrics/metricsSetup');
const subscriptionValidator = new SubscriptionValidator();
const subscriptionRepo = new SubscriptionRepo(metricsProvider);
const subscriptionService = new SubscriptionService(subscriptionRepo, logger, metricsProvider);
const subscriptionController = new SubscriptionController(subscriptionService, subscriptionValidator);

module.exports = {
    subscriptionController
};
