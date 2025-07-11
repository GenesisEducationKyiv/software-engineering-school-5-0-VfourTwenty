class WeatherError extends Error 
{
    constructor(message) 
    {
        super(message);
        this.name = 'WeatherError';
    }
}

module.exports = WeatherError; 
