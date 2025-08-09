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

metricsProvider.registerMetric('counter', METRIC_KEYS.EMAILS_SENT_TOTAL, 'Total number of emails sent');
metricsProvider.registerMetric('counter', METRIC_KEYS.EMAILS_FAILED_TOTAL, 'Total number of failed sent');

metricsProvider.registerMetric('counter', METRIC_KEYS.EXTERNAL_API_CALLS, 'Total number of external API calls', {
    labelNames: ['provider', 'success']
});

metricsProvider.registerMetric('gauge', METRIC_KEYS.APP_UPTIME, 'Application uptime in seconds', {
    labelNames: ['service'] });

module.exports = metricsProvider;

