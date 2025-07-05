const SequelizeSubscriptionRepo = require('repositories/sequelizeSubscriptionRepo');

const SubscriptionService = require('services/subscriptionService');
const WeatherService = require('services/weatherService');
const EmailService = require('services/emailService');

const HomepageController = require('controllers/homepageController');
const SubscriptionPublicController = require('controllers/subscriptionPublicController')
const SubscriptionApiController = require('controllers/subscriptionApiController');
const WeatherApiController = require('controllers/weatherApiController');


// 1
const subscriptionRepo = new SequelizeSubscriptionRepo();

// 2
const weatherService = new WeatherService();
const emailService = new EmailService(weatherService, subscriptionRepo);
const subscriptionService = new SubscriptionService(emailService, subscriptionRepo);


// 3
const homepageController = new HomepageController();
const subscriptionPublicController = new SubscriptionPublicController(subscriptionService);
const subscriptionApiController = new SubscriptionApiController(subscriptionService);
const weatherApiController = new WeatherApiController();