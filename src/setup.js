const SequelizeSubscriptionRepo = require('./repositories/sequelizeSubscriptionRepo');

const EmailProviderManager = require('./providers/email-providers/emailProviderManager')

const SubscriptionService = require('./services/subscriptionService');
const WeatherService = require('./services/weatherService');
const EmailService = require('./services/emailService');

const HomepageController = require('./controllers/homepageController');
const SubscriptionPublicController = require('./controllers/subscriptionPublicController')
const SubscriptionApiController = require('./controllers/subscriptionApiController');
const WeatherApiController = require('./controllers/weatherApiController');

const EmailJobs = require('./cron/emailJobs')
const CronMain = require('./cron/main')

// 1
const subscriptionRepo = new SequelizeSubscriptionRepo();

// 2
const emailProviderManager = new EmailProviderManager();

// 3
const weatherService = new WeatherService();
const emailService = new EmailService(weatherService, subscriptionRepo, emailProviderManager);
const subscriptionService = new SubscriptionService(emailService, subscriptionRepo);

// 4
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(subscriptionService);
const subscriptionApiController = new SubscriptionApiController(subscriptionService, weatherService);
const weatherApiController = new WeatherApiController(weatherService);

// cron
const emailJobs = new EmailJobs(emailService);
const cronMain = new CronMain(emailJobs);

module.exports = {
    homepageController,
    subscriptionPublicController,
    subscriptionApiController,
    weatherApiController,
    cronMain
}