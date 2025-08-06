const PromMetricsProvider = require('./prometheus/promMetricsProvider');

const metricsProvider = new PromMetricsProvider();

metricsProvider.registerMetric('counter', 'weatherCacheHits', 'Total number of weather cache hits');
metricsProvider.registerMetric('counter', 'weatherCacheMisses', 'Total number of weather cache misses');

module.exports = metricsProvider;
