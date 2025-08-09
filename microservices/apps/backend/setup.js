const QueuePublisher = require('./src/common/queue/rabbitMQ/RabbitMQPublisher');

const SubscriptionService = require('./src/application/services/subscriptionService');
const WeatherService = require('./src/application/services/weatherService');

const CityValidator = require('./src/application/validators/cityValidator');
const SubscriptionUseCase = require('./src/application/use-cases/subscriptionUseCase');
const GetWeatherUseCase = require('./src/application/use-cases/getWeatherUseCase');
const WeatherUpdatesUseCase = require('./src/application/use-cases/weatherUpdatesUseCase');

const SubscriptionDtoValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const WeatherController = require('./src/presentation/controllers/weatherController');

const EmailJobHandler = require('./src/infrastructure/cron/handlers/emailJobHandler');
const EmailJobs = require('./src/infrastructure/cron/emailJobs');
const CronMain = require('./src/infrastructure/cron/main');

const config = require('./src/common/config/index').queue;
const queuePublisher = new QueuePublisher(config.queueUrl, config.queueName);

// call dedicated services' APIs
const subscriptionService = new SubscriptionService();
const weatherService = new WeatherService();

const cityValidator = new CityValidator(weatherService);
const subscriptionUseCase = new SubscriptionUseCase(cityValidator, subscriptionService, queuePublisher);
const getWeatherUseCase = new GetWeatherUseCase(weatherService);
const weatherUpdatesUseCase = new WeatherUpdatesUseCase(weatherService, subscriptionService, queuePublisher);

const subscriptionDtoValidator = new SubscriptionDtoValidator();
const subscriptionController = new SubscriptionController(
    subscriptionDtoValidator, subscriptionUseCase);
const weatherController = new WeatherController(getWeatherUseCase);

const emailJobHandler = new EmailJobHandler(weatherUpdatesUseCase);
const emailJobs = new EmailJobs(emailJobHandler);
const cronMain = new CronMain(emailJobs);

module.exports = {
    weatherController,
    subscriptionController,
    cronMain
}
