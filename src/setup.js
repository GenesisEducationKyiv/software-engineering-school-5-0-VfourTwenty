const SequelizeSubscriptionRepo = require('./repositories/sequelizeSubscriptionRepo');

const WeatherApiProvider = require('./providers/weather-providers/weatherApiProvider');
const ResendEmailProvider = require('./providers/email-providers/resendEmailProvider');

const WeatherProviderManger = require('./providers/weather-providers/weatherProviderManager');
const EmailProviderManager = require('./providers/email-providers/emailProviderManager');

const SubscriptionService = require('./services/subscriptionService');
const WeatherService = require('./services/weatherService');
const EmailService = require('./services/emailService');

const ConfirmationEmailUseCase = require('../src/domain/use-cases/confirmationEmailUseCase');
const UnsubscribeEmailUseCase = require('../src/domain/use-cases/unsubscribeEmailUseCase');
const WeatherUpdatesUseCase = require('./domain/use-cases/weatherUpdatesUseCase');

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
// dependency injection will be replaced with communication (eg http)

// 4
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(subscriptionService);
const subscriptionApiController = new SubscriptionApiController(subscriptionService);
const weatherApiController = new WeatherApiController(weatherService);

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
