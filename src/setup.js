const SequelizeSubscriptionRepo = require('./repositories/sequelizeSubscriptionRepo');

const WeatherApiProvider = require('./providers/weather-providers/weatherApiProvider');
const ResendEmailProvider = require('./providers/email-providers/resendEmailProvider');

const WeatherProviderManger = require('./providers/weather-providers/weatherProviderManager');
const EmailProviderManager = require('./providers/email-providers/emailProviderManager');

const SubscriptionService = require('./services/subscriptionService');
const WeatherService = require('./services/weatherService');
const EmailService = require('./services/emailService');

const ConfirmationEmailUseCase = require('./domain/use-cases/emails/confirmationEmailUseCase');
const UnsubscribeEmailUseCase = require('./domain/use-cases/emails/unsubscribeEmailUseCase');
const WeatherUpdatesUseCase = require('./domain/use-cases/emails/weatherUpdatesUseCase');

const SubscribeUserUseCase = require('./domain/use-cases/subscription/subscribeUserUseCase');
const FindSubscriptionUseCase = require('./domain/use-cases/subscription/findSubscriptionUseCase');
const ConfirmSubscriptionUseCase = require('./domain/use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('./domain/use-cases/subscription/unsubscribeUserUseCase');

const GetWeatherUseCase = require('./domain/use-cases/weather/getWeatherUseCase');

const CityValidator = require('./validators/cityValidator');
const SubscriptionValidator = require('./validators/subscriptionValidator');

const HomepageController = require('./controllers/homepageController');
const SubscriptionPublicController = require('./controllers/subscriptionPublicController');
const SubscriptionApiController = require('./controllers/subscriptionApiController');
const WeatherApiController = require('./controllers/weatherApiController');

const EmailJobHandler = require('./cron/handlers/emailJobHandler');
const EmailJobs = require('./cron/emailJobs');
const CronMain = require('./cron/main');

// 1
const subscriptionRepo = new SequelizeSubscriptionRepo();

// 2
const weatherProviders = [new WeatherApiProvider()];
const emailProviders = [new ResendEmailProvider()];

const weatherProviderManager = new WeatherProviderManger(weatherProviders);
const emailProviderManager = new EmailProviderManager(emailProviders);

// 3
const weatherService = new WeatherService(weatherProviderManager);
const emailService = new EmailService(emailProviderManager);

const cityValidator = new CityValidator(weatherService);
const subscriptionValidator = new SubscriptionValidator(subscriptionRepo, cityValidator);

const confirmationEmailUseCase = new ConfirmationEmailUseCase(emailService);
const unsubscribeEmailUseCase = new UnsubscribeEmailUseCase(emailService);
const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailService, weatherService, subscriptionRepo);

const subscriptionService = new SubscriptionService(confirmationEmailUseCase, unsubscribeEmailUseCase, subscriptionRepo, subscriptionValidator);
// dependency injection will be replaced with communication (e.g. http)

const subscribeUserUseCase = new SubscribeUserUseCase(subscriptionService);
const findSubscriptionUseCase = new FindSubscriptionUseCase(subscriptionService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService);

const getWeatherUseCase = new GetWeatherUseCase(weatherService);

// 5
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(findSubscriptionUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const subscriptionApiController = new SubscriptionApiController(subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const weatherApiController = new WeatherApiController(getWeatherUseCase);

// cron
const emailJobHandler = new EmailJobHandler(weatherUpdatesUseCase);
const emailJobs = new EmailJobs(emailJobHandler);
const cronMain = new CronMain(emailJobs);

module.exports = {
    homepageController,
    subscriptionPublicController,
    subscriptionApiController,
    weatherApiController,
    cronMain,
    // exported only for e2e tests
    subscriptionService,
    subscriptionRepo
};
