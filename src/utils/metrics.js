const client = require('prom-client');

const register = new client.Registry();

const weatherCacheHit = new client.Counter({
    name: 'weather_cache_hit_total',
    help: 'Total number of weather cache hits',
});
const weatherCacheMiss = new client.Counter({
    name: 'weather_cache_miss_total',
    help: 'Total number of weather cache misses',
});

register.registerMetric(weatherCacheHit);
register.registerMetric(weatherCacheMiss);

module.exports = {
    register,
    weatherCacheHit,
    weatherCacheMiss,
};