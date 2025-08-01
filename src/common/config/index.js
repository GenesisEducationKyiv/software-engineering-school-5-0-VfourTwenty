require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

// logger
const logLevel = process.env.LOG_LEVEL;
const logLevelStrict = process.env.LOG_LEVEL_STRICT === 'true';
const logFilePath = logLevel === 'null' ? '' : process.env.LOG_FILE_PATH;
const logToConsole = process.env.LOG_TO_CONSOLE === 'true';
const logSamplingRate = process.env.LOG_SAMPLING_RATE;
// domain
const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

// redis
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisTTL = process.env.REDIS_TTL;
const redisConnectRetries = process.env.REDIS_CONNECT_RETRIES;
const redisConnectDelay = process.env.REDIS_CONNECT_DELAY;
// weather providers
const weatherApiKey = process.env.WEATHER_API_KEY;
const tomorrowIoApiKey = process.env.TOMORROW_IO_API_KEY;
const visualCrossingApiKey = process.env.VISUAL_CROSSING_API_KEY;
// email config
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

module.exports = {
    logger: {
        logLevel,
        logLevelStrict,
        logFilePath,
        logToConsole,
        logSamplingRate,
    },
    domain: {
        baseUrl,
    },
    redis: {
        redisHost,
        redisPort,
        redisTTL,
        redisConnectRetries,
        redisConnectDelay,
    },
    weatherProviders: {
        weatherApiKey,
        tomorrowIoApiKey,
        visualCrossingApiKey,
    },
    email: {
        resendApiKey,
        fromEmail,
    }
};
