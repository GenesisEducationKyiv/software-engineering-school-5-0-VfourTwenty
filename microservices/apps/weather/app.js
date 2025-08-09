const express = require('express');
const app = express();

const { register } = require('./src/common/metrics/prometheus/promClient');
const metricsMiddleware = require('./src/presentation/middleware/metricsMiddleware');

const metricsProvider = require('./src/common/metrics/metricsSetup');
const metricsKeys = require('./src/common/metrics/metricsKeys');

const weatherRouter = require('./src/presentation/routes/weatherRouter');

app.use('/', weatherRouter);

app.use(metricsMiddleware);

app.get('/metrics', async (req, res) =>
{
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const { connectToRedisWithRetry } = require('./src/common/cache/redis/redisClient');
connectToRedisWithRetry();

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => 
{
    console.log(`Weather service running on port ${PORT}`);
});

const startTime = Date.now();
setInterval(() =>
{
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    metricsProvider.setGauge(metricsKeys.APP_UPTIME, uptimeSeconds, { service: 'weather' });
}, 10000);
