const PromMetricsProvider = require('./prometheus/promMetricsProvider');
const METRICS_KEYS = require('./metricsKeys');

const metricsProvider = new PromMetricsProvider();

metricsProvider.registerMetric('counter', METRICS_KEYS.WEATHER_CACHE_HITS, 'Total number of weather cache hits');
metricsProvider.registerMetric('counter', METRICS_KEYS.WEATHER_CACHE_MISSES, 'Total number of weather cache misses');

module.exports = metricsProvider;
