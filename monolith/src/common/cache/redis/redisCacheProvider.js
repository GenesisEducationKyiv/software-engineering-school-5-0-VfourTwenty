const ICacheProvider = require('../cacheProviderInterface');
const { redisClient } = require('./redisClient');
const config = require('../../config/index').redis;

class RedisCacheProvider extends ICacheProvider
{
    constructor()
    {
        super();
        this.client = redisClient;
    }

    async get(key)
    {
        return this.client.get(key);
    }

    async set(key, value, ttl = config.redisTTL)
    {
        return this.client.set(key, value, { EX: ttl });
    }
}

module.exports = RedisCacheProvider;

