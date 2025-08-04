const EmailService = require('./src/application/services/emailService');
const SubscriptionService = require('./src/application/services/subscriptionService');
const WeatherService = require('./src/application/services/weatherService');

const CityValidator = require('./src/application/validators/cityValidator');
const SubscribeUserUseCase = require('./src/application/use-cases/subscription/subscribeUserUseCase');
const ConfirmSubscriptionUseCase = require('./src/application/use-cases/subscription/confirmSubscriptionUseCase');
const UnsubscribeUserUseCase = require('./src/application/use-cases/subscription/unsubscribeUserUseCase');
const GetWeatherUseCase = require('./src/application/use-cases/weather/getWeatherUseCase');

const SubscriptionDtoValidator = require('./src/presentation/validators/subscriptionDtoValidator');
const SubscriptionController = require('./src/presentation/controllers/subscriptionController');

const WeatherController = require('./src/presentation/controllers/weatherController');

// call dedicated services' APIs
const emailService = new EmailService();
const subscriptionService = new SubscriptionService();
const weatherService = new WeatherService();

const cityValidator = new CityValidator(weatherService);
const subscribeUserUseCase = new SubscribeUserUseCase(cityValidator, subscriptionService, emailService);
const confirmSubscriptionUseCase = new ConfirmSubscriptionUseCase(subscriptionService);
const unsubscribeUserUseCase = new UnsubscribeUserUseCase(subscriptionService, emailService);
const getWeatherUseCase = new GetWeatherUseCase(weatherService);

const subscriptionDtoValidator = new SubscriptionDtoValidator();
const subscriptionController = new SubscriptionController(
    subscriptionDtoValidator, subscribeUserUseCase, confirmSubscriptionUseCase, unsubscribeUserUseCase);
const weatherController = new WeatherController(getWeatherUseCase);

module.exports = {
    weatherController,
    subscriptionController
}
