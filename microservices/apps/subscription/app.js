const express = require('express');
const app = express();
app.use(express.json());

const { register } = require('./src/common/metrics/prometheus/promClient');
const metricsMiddleware = require('./src/presentation/middleware/metricsMiddleware');

const metricsProvider = require('./src/common/metrics/metricsSetup');
const metricsKeys = require('./src/common/metrics/metricsKeys');

const subscriptionRouter = require('./src/presentation/routes/subscriptionRouter');

app.use(metricsMiddleware);

app.use('/api', subscriptionRouter);

app.get('/metrics', async (req, res) =>
{
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => 
{
    console.log(`Subscription running on port ${PORT}`);
});

const startTime = Date.now();
setInterval(() =>
{
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    metricsProvider.setGauge(metricsKeys.APP_UPTIME, uptimeSeconds, { service: 'subscription' });
}, 10000);
