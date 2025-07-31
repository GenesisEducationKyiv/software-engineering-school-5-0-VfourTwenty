const redis = require('redis');
const config = require('../config');
const retry = require('./retry'); // Adjust the path if needed

const redisClient = redis.createClient({
    socket: {
        host: config.redisHost,
        port: config.redisPort,
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectToRedisWithRetry(
    client = redisClient,
    retries = config.redisConnectRetries,
    delay = config.redisConnectDelay)
{
    try
    {
        await retry(
            () => client.connect(),
            retries,
            delay
        );
        console.log('Redis connected successfully');
    }
    catch (err)
    {
        console.error('Failed to connect to Redis after retries:', err);
        process.exit(1);
    }
}

module.exports = { redisClient, connectToRedisWithRetry };
