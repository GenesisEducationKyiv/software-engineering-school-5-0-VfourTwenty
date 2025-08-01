const Logger = require('./common/utils/logger');

const SequelizeSubscriptionRepo = require('./infrastructure/adapters/db/repositories/sequelizeSubscriptionRepo');

const { redisClient } = require('./common/utils/redisClient');
const { weatherCacheHit, weatherCacheMiss } = require('./common/utils/promWeatherMetrics');

const WeatherApiProvider = require('./infrastructure/adapters/providers/weather-providers/weatherApiProvider');
const VisualCrossingWeatherProvider = require('./infrastructure/adapters/providers/weather-providers/visualCrossingWeatherProvider');
const TomorrowWeatherProvider = require('./infrastructure/adapters/providers/weather-providers/tomorrowWeatherProvider');

const ResendEmailProvider = require('./infrastructure/adapters/providers/email-providers/resendEmailProvider');

const WeatherProviderManger = require('./infrastructure/adapters/providers/weather-providers/weatherProviderManager');
const EmailProviderManager = require('./infrastructure/adapters/providers/email-providers/emailProviderManager');

const SubscriptionService = require('./services/subscriptionService');
const WeatherServiceWithCacheAndMetrics = require('./services/weatherService');
const EmailService = require('./services/emailService');

const WeatherUpdatesUseCase = require('./application/use-cases/emails/weatherUpdatesUseCase');

const SubscribeUserUseCase = require('./application/use-cases/subscription/subscribeUserUseCase');
const ConfirmSubscriptionUseCase = require('./application/use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('./application/use-cases/subscription/unsubscribeUserUseCase');

const GetWeatherUseCase = require('./application/use-cases/weather/getWeatherUseCase');

const CityValidator = require('./application/validators/cityValidator');
const SubscriptionValidator = require('./presentation/validators/subscriptionValidator');

const HomepageController = require('./presentation/controllers/homepageController');
const SubscriptionPublicController = require('./presentation/controllers/subscriptionPublicController');
const SubscriptionApiController = require('./presentation/controllers/subscriptionApiController');
const WeatherApiController = require('./presentation/controllers/weatherApiController');

const EmailJobHandler = require('./infrastructure/entry-points/cron/handlers/emailJobHandler');
const EmailJobs = require('./infrastructure/entry-points/cron/emailJobs');
const CronMain = require('./infrastructure/entry-points/cron/main');

// dependency injection will be replaced with communication (e.g. http)

const loggerConfig = require('./common/config/index').logger;
const logger = new Logger(loggerConfig);

// 1
const subscriptionRepo = new SequelizeSubscriptionRepo();

const visualCrossingProvider = new VisualCrossingWeatherProvider();
const tomorrowWeatherProvider = new TomorrowWeatherProvider();
const weatherApiProvider = new WeatherApiProvider();

const resendEmailProvider = new ResendEmailProvider();

// 2
const weatherProviders = [visualCrossingProvider, tomorrowWeatherProvider, weatherApiProvider];
const emailProviders = [resendEmailProvider];

const weatherProviderManager = new WeatherProviderManger(weatherProviders, logger);
const emailProviderManager = new EmailProviderManager(emailProviders);

// 3
const weatherService = new WeatherServiceWithCacheAndMetrics(weatherProviderManager, redisClient, weatherCacheHit, weatherCacheMiss);
const emailService = new EmailService(emailProviderManager);
const subscriptionService = new SubscriptionService(subscriptionRepo);

// 4
const cityValidator = new CityValidator(weatherService);

// 5
const getWeatherUseCase = new GetWeatherUseCase(weatherService);
const weatherUpdatesUseCase = new WeatherUpdatesUseCase(emailService, weatherService, subscriptionService);

const subscribeUserUseCase = new SubscribeUserUseCase(cityValidator, subscriptionService, emailService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService, emailService);

// 6
const subscriptionValidator = new SubscriptionValidator();

const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(subscriptionValidator, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const subscriptionApiController = new SubscriptionApiController(
    subscriptionValidator, subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
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
