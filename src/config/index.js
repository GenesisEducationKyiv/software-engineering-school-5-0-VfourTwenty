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
//db config
const use_env_variable = 'DATABASE_URL';
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;
// redis
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
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
    logLevel,
    logLevelStrict,
    logFilePath,
    logToConsole,
    logSamplingRate,
    baseUrl,
    redisHost,
    redisPort,
    redisConnectRetries,
    redisConnectDelay,
    use_env_variable,
    username,
    password,
    database,
    host,
    dialect,
    weatherApiKey,
    tomorrowIoApiKey,
    visualCrossingApiKey,
    resendApiKey,
    fromEmail
};
