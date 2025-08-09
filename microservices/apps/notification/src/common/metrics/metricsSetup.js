const PromMetricsProvider = require('./prometheus/promMetricsProvider');
const METRIC_KEYS = require('./metricsKeys');

const metricsProvider = new PromMetricsProvider();

metricsProvider.registerMetric('counter', METRIC_KEYS.CONFIRMATION_EMAILS_TOTAL, 'Total number of confirmation emails sent', {
    labelNames: ['success'] });

metricsProvider.registerMetric('counter', METRIC_KEYS.UNSUBSCRIBED_EMAILS_TOTAL, 'Total number of unsubscribed email sent', {
    labelNames: ['success'] });

metricsProvider.registerMetric('counter', METRIC_KEYS.WEATHER_UPDATE_EMAILS_TOTAL, 'Total number of weather update emails sent', {
    labelNames: ['success'] });

metricsProvider.registerMetric('counter', METRIC_KEYS.QUEUE_JOBS_CONSUMED, 'Total number of queue jobs published', {
    labelNames: ['event'] });

metricsProvider.registerMetric(
    'histogram',
    METRIC_KEYS.QUEUE_CONSUMER_DURATION,
    'Duration of queue consumer processing in seconds',
    {
        labelNames: ['queue', 'event_type'],
        buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
    }
);

metricsProvider.registerMetric('gauge', METRIC_KEYS.APP_UPTIME, 'Application uptime in seconds', {
    labelNames: ['service'] });

module.exports = metricsProvider;

