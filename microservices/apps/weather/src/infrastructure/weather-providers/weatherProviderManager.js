const IWeatherProvider = require('../../domain/interfaces/weatherProviderInterface');
const Result = require('../../common/utils/result');
const metricsKeys = require('../../common/metrics/metricsKeys');

class WeatherProviderManager extends IWeatherProvider
{
    constructor(providers, logger, metricsProvider)
    {
        super();
        this.providers = providers;
        this.log = logger.for('WeatherProviderManager');
        this.metricsProvider = metricsProvider;
    }

    async fetchWeather(city)
    {
        let resultObj = {
            temperature: null,
            humidity: null,
            description: null
        };
        for (const provider of this.providers)
        {
            try
            {
                console.log('fetching weather for ', city);
                const response = await provider.fetchWeather(city);
                this.log.info(`Fetching weather for ${city}...`);
                this.log.info(`Response from provider ${provider.name}: `, response);
                if (response?.success)
                {
                    const { temperature, humidity, description } = response.data;
                    if (resultObj.temperature === null && temperature != null)
                    {
                        this.log.debug(`Using temperature value ${temperature}`);
                        resultObj.temperature = temperature;
                    }
                    if (resultObj.humidity === null && humidity != null)
                    {
                        this.log.debug(`Using humidity value ${humidity}`);
                        resultObj.humidity = humidity;
                    }
                    if ((resultObj.description === null || resultObj.description === '') && description != null && description !== '')
                    {
                        this.log.debug(`Using description value ${description}`);
                        resultObj.description = description;
                    }
                    this.metricsProvider.incrementCounter(metricsKeys.EXTERNAL_API_CALLS, 1, {
                        provider: provider.name, success: true
                    });
                }
                else
                {
                    console.log(provider.name, 'failed');
                    this.log.warn(`External provider ${provider.name} failed`);
                    this.metricsProvider.incrementCounter(metricsKeys.EXTERNAL_API_CALLS, 1, {
                        provider: provider.name, success: false
                    });
                }
            }
            catch (err)
            {
                this.log.error('External provider error', JSON.stringify(err));
            }
            if (this.resultIsReady(resultObj))
            {
                console.log('weather is ready in provider manager: ', resultObj);
                this.log.info('Result object is ready: ', resultObj);
                return new Result(true, null, resultObj);
            }
        }
        console.log('all providers failed for', city);
        this.log.error('All external providers have failed');
        return new Result(false, 'all weather providers have failed', null);
    }

    resultIsReady(resultObj)
    {
        return (
            resultObj.temperature !== null &&
            resultObj.humidity !== null &&
            resultObj.description !== null &&
            resultObj.description !== ''
        );
    }
}
module.exports = WeatherProviderManager;
