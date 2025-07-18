const IWeatherProvider = require('./weatherProviderInterface');
const DTO = require('../../domain/types/dto');
// const { logProviderResponse } = require('../../utils/logger');
// const path = require('path');

class WeatherProviderManager extends IWeatherProvider 
{
    constructor(providers)
    {
        super();
        this.providers = providers;
        // this.logPath = path.join(__dirname, '../../../logs/weatherProvider.log');
    }

    async fetchWeather(city) 
    {
        for (const provider of this.providers) 
        {
            try 
            {
                // Receives WeatherDTO
                const result = await provider.fetchWeather(city);
                // logProviderResponse(this.logPath, provider.name, { city, ...result });
                if (result?.success) return result;
                // log result.err
            }
            catch (err) 
            {
                // should not happen with weatherDTO but still
                console.log(err);
                // log
                // logProviderResponse(this.logPath, provider.name, { city, error: err }, true);
            }
        }
        return new DTO(false, 'all weather providers have failed'); // No data from any provider
    }
}

module.exports = WeatherProviderManager;
