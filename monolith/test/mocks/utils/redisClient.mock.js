class RedisClientMock
{
    constructor()
    {
        this.cache = {};
    }

    _toWeatherKey(key)
    {
        return `weather:${key.toLowerCase()}`;
    }

    async get(key)
    {
        return this.cache[key];
    }

    async setEx(key, ttl, objAsString)
    {
        this.cache[key] = objAsString;
    }
}

module.exports = RedisClientMock;
