const redis = require('redis');
const config = require('../config/index');
const retry = require('../utils/retry'); // Adjust the path if needed

const client = redis.createClient({
    socket: {
        host: config.redisHost,
        port: config.redisPort,
    },
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectWithRetry(client, retries = 5, delay = 1000)
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

connectWithRetry(client, config.redisConnectRetries, config.redisConnectDelay);

module.exports = client;
