class ICacheProvider
{
    async get(key)
    {
        throw new Error('Not implemented');
    }

    async set(key, value, ttl)
    {
        throw new Error('Not implemented');
    }
}

module.exports = ICacheProvider;
