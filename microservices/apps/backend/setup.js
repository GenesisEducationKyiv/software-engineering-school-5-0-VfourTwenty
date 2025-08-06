const EmailService = require('./src/application/services/emailService');
const SubscriptionService = require('./src/application/services/subscriptionService');
const WeatherService = require('./src/application/services/weatherService');

const CityValidator = require('./src/application/validators/cityValidator');
const SubscribeUserUseCase = require('./src/application/use-cases/subscription/subscribeUserUseCase');
const ConfirmSubscriptionUseCase = require('./src/application/use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('./src/application/use-cases/subscription/unsubscribeUserUseCase');
const GetWeatherUseCase = require('./src/application/use-cases/weather/getWeatherUseCase');
const WeatherUpdatesUseCase = require('./src/application/use-cases/emails/weatherUpdatesUseCase');

const SubscriptionDtoValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const WeatherController = require('./src/presentation/controllers/weatherController');

const EmailJobHandler = require('./src/infrastructure/cron/handlers/emailJobHandler');
const EmailJobs = require('./src/infrastructure/cron/emailJobs');
const CronMain = require('./src/infrastructure/cron/main');

// call dedicated services' APIs
const emailService = new EmailService();
const subscriptionService = new SubscriptionService();
const weatherService = new WeatherService();

const cityValidator = new CityValidator(weatherService);
const subscribeUserUseCase = new SubscribeUserUseCase(cityValidator, subscriptionService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService);
const getWeatherUseCase = new GetWeatherUseCase(weatherService);
const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailService, weatherService, subscriptionService);

const subscriptionDtoValidator = new SubscriptionDtoValidator();
const subscriptionController = new SubscriptionController(
    subscriptionDtoValidator, subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const weatherController = new WeatherController(getWeatherUseCase);

const emailJobHandler = new EmailJobHandler(weatherUpdatesUseCase);
const emailJobs = new EmailJobs(emailJobHandler);
const cronMain = new CronMain(emailJobs);

module.exports = {
    weatherController,
    subscriptionController,
    cronMain
}
