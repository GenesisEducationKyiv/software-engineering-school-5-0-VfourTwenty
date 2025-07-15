const SequelizeSubscriptionRepo = require('./repositories/sequelizeSubscriptionRepo');

const WeatherApiProvider = require('./providers/weather-providers/weatherApiProvider');
const ResendEmailProvider = require('./providers/email-providers/resendEmailProvider');

const WeatherProviderManger = require('./providers/weather-providers/weatherProviderManager');
const EmailProviderManager = require('./providers/email-providers/emailProviderManager');

const SubscriptionService = require('./services/subscriptionService');
const WeatherService = require('./services/weatherService');
const EmailService = require('./services/emailService');

const CityValidator = require('./validators/validateCity');
const SubscriptionValidator = require('./validators/validateNewSubscription');

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
const emailService = new EmailService(weatherService, subscriptionRepo, emailProviderManager);

const cityValidator = new CityValidator(weatherService);
const subscriptionValidator = new SubscriptionValidator(subscriptionRepo, cityValidator);

const subscriptionService = new SubscriptionService(emailService, subscriptionRepo, subscriptionValidator);

// 4
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(subscriptionService);
const subscriptionApiController = new SubscriptionApiController(subscriptionService);
const weatherApiController = new WeatherApiController(weatherService);

// cron
const emailJobHandler = new EmailJobHandler(emailService);
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
