const PromMetricsProvider = require('./prometheus/promMetricsProvider');
const METRICS_KEYS = require('./metricsKeys');

const metricsProvider = new PromMetricsProvider();

metricsProvider.registerMetric('counter', METRICS_KEYS.WEATHER_CACHE_HITS, 'Total number of weather cache hits');
metricsProvider.registerMetric('counter', METRICS_KEYS.WEATHER_CACHE_MISSES, 'Total number of weather cache misses');

metricsProvider.registerMetric('counter', METRICS_KEYS.HTTP_REQUESTS_TOTAL, 'Total number of HTTP requests', {
    labelNames: ['method', 'route', 'status_code']
});
metricsProvider.registerMetric('histogram', METRICS_KEYS.HTTP_REQUEST_DURATION, 'Duration of HTTP requests in seconds', {
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 1.5, 10]
});
metricsProvider.registerMetric('counter', METRICS_KEYS.HTTP_REQUEST_ERRORS, 'Total number of HTTP request errors', {
    labelNames: ['method', 'route', 'status_code']
});

metricsProvider.registerMetric('counter', METRICS_KEYS.EXTERNAL_API_CALLS, 'Total number of external API calls', {
    labelNames: ['provider', 'success']
});

metricsProvider.registerMetric('gauge', METRICS_KEYS.APP_UPTIME, 'Application uptime in seconds', {
    labelNames: ['service'] });

module.exports = metricsProvider;
