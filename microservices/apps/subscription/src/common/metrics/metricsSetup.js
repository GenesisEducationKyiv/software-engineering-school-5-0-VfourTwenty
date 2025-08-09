const PromMetricsProvider = require('./prometheus/promMetricsProvider');
const METRIC_KEYS = require('./metricsKeys');

const metricsProvider = new PromMetricsProvider();

metricsProvider.registerMetric('counter', METRIC_KEYS.HTTP_REQUESTS_TOTAL, 'Total number of HTTP requests', {
    labelNames: ['method', 'route', 'status_code']
});

metricsProvider.registerMetric('histogram', METRIC_KEYS.HTTP_REQUEST_DURATION, 'Duration of HTTP requests in seconds', {
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 1.5, 10]
});

metricsProvider.registerMetric('counter', METRIC_KEYS.HTTP_REQUEST_ERRORS, 'Total number of HTTP request errors', {
    labelNames: ['method', 'route', 'status_code']
});

metricsProvider.registerMetric(
    'counter',
    METRIC_KEYS.SUBSCRIPTIONS_CREATED_TOTAL,
    'Total number of subscriptions created',
);

metricsProvider.registerMetric(
    'counter',
    METRIC_KEYS.SUBSCRIPTIONS_CONFIRMED_TOTAL,
    'Total number of subscriptions confirmed',
);

metricsProvider.registerMetric(
    'counter',
    METRIC_KEYS.SUBSCRIPTIONS_CANCELED_TOTAL,
    'Total number of subscriptions canceled',
);

metricsProvider.registerMetric(
    'histogram',
    METRIC_KEYS.DB_QUERY_DURATION,
    'Duration of DB queries in seconds',
    { labelNames: ['operation'], buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5] }
);

metricsProvider.registerMetric(
    'counter',
    METRIC_KEYS.DB_QUERY_ERRORS,
    'Total number of DB query errors',
    { labelNames: ['operation'] }
);

metricsProvider.registerMetric('gauge', METRIC_KEYS.APP_UPTIME, 'Application uptime in seconds', {
    labelNames: ['service'] });

module.exports = metricsProvider;

