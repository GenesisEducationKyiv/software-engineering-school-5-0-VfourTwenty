const Logger = require('./utils/logger');

const SequelizeSubscriptionRepo = require('./repositories/sequelizeSubscriptionRepo');

const WeatherApiProvider = require('./providers/weather-providers/weatherApiProvider');
const VisualCrossingWeatherProvider = require('./providers/weather-providers/visualCrossingWeatherProvider');
const TomorrowWeatherProvider = require('./providers/weather-providers/tomorrowWeatherProvider');

const ResendEmailProvider = require('./providers/email-providers/resendEmailProvider');

const WeatherProviderManger = require('./providers/weather-providers/weatherProviderManager');
const EmailProviderManager = require('./providers/email-providers/emailProviderManager');

const SubscriptionService = require('./services/subscriptionService');
const WeatherService = require('./services/weatherService');
const EmailService = require('./services/emailService');

const WeatherUpdatesUseCase = require('./use-cases/emails/weatherUpdatesUseCase');

const SubscribeUserUseCase = require('./use-cases/subscription/subscribeUserUseCase');
const ConfirmSubscriptionUseCase = require('./use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('./use-cases/subscription/unsubscribeUserUseCase');

const GetWeatherUseCase = require('./use-cases/weather/getWeatherUseCase');

const CityValidator = require('./domain/validators/cityValidator');
const SubscriptionValidator = require('./domain/validators/subscriptionValidator');

const HomepageController = require('./controllers/homepageController');
const SubscriptionPublicController = require('./controllers/subscriptionPublicController');
const SubscriptionApiController = require('./controllers/subscriptionApiController');
const WeatherApiController = require('./controllers/weatherApiController');

const EmailJobHandler = require('./cron/handlers/emailJobHandler');
const EmailJobs = require('./cron/emailJobs');
const CronMain = require('./cron/main');

// dependency injection will be replaced with communication (e.g. http)

const config = require('./config/index');
const logger = new Logger(
    {
        level: config.logLevel,
        levelStrict: config.logLevelStrict,
        logFilePath: config.logFilePath,
        writeToConsole: config.logToConsole,
        samplingRate: config.logSamplingRate,
        // sampling rate can be added, defaults to 1
    });

// 1
const subscriptionRepo = new SequelizeSubscriptionRepo();

// 2
const weatherProviders = [new VisualCrossingWeatherProvider(), new TomorrowWeatherProvider(), new WeatherApiProvider()];
const emailProviders = [new ResendEmailProvider()];

const weatherProviderManager = new WeatherProviderManger(weatherProviders, logger);
const emailProviderManager = new EmailProviderManager(emailProviders);

// 3
const weatherService = new WeatherService(weatherProviderManager);
const emailService = new EmailService(emailProviderManager);
const subscriptionService = new SubscriptionService(subscriptionRepo);

// 4
const cityValidator = new CityValidator(weatherService);
const subscriptionValidator = new SubscriptionValidator(cityValidator);

// 5
const getWeatherUseCase = new GetWeatherUseCase(weatherService);
const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailService, weatherService, subscriptionService);

const subscribeUserUseCase = new SubscribeUserUseCase(subscriptionValidator, subscriptionService, emailService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService, emailService);

// 6
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(confirmSubscriptionUseCase, unsubscribeUserUseCase);
const subscriptionApiController = new SubscriptionApiController(subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const weatherApiController = new WeatherApiController(getWeatherUseCase);

// 7 cron
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
