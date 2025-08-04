const Logger = require('./src/common/utils/logger.mock');

const WeatherApiProvider = require('./src/infrastructure/weather-providers/weatherApiProvider');
const TomorrowWeatherProvider = require('./src/infrastructure/weather-providers/tomorrowWeatherProvider');
const VisualCrossingWeatherProvider = require('./src/infrastructure/weather-providers/visualCrossingWeatherProvider');

const WeatherProviderManager = require('./src/infrastructure/weather-providers/weatherProviderManager');
const WeatherService = require('./src/application/weatherService');
const WeatherController = require('./src/presentation/controllers/weatherController');

const logger = new Logger();

const weatherProviders = [new WeatherApiProvider(), new TomorrowWeatherProvider(), new VisualCrossingWeatherProvider()];
const weatherProviderManger = new WeatherProviderManager(weatherProviders, logger);
const weatherService = new WeatherService(weatherProviderManger);
const weatherController = new WeatherController(weatherService);

module.exports =
    {
        weatherController
    }