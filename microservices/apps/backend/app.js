const express = require('express');
const app = express();
app.use(express.json());

const { cronMain } = require('./setup');

const { register } = require('./src/common/metrics/prometheus/promClient');
const metricsMiddleware = require('./src/presentation/middleware/metricsMiddleware');

const metricsProvider = require('./src/common/metrics/metricsSetup');
const metricsKeys = require('./src/common/metrics/metricsKeys');

const weatherRouter = require('./src/presentation/routes/weather');
const subscriptionRouter = require('./src/presentation/routes/subscription');

app.use(metricsMiddleware);

app.use('/api', weatherRouter);
app.use('/api', subscriptionRouter);

app.get('/metrics', async (req, res) =>
{
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => 
{
    console.log(`Backend running on port ${PORT}`);
});

cronMain.start();

const startTime = Date.now();
setInterval(() =>
{
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    metricsProvider.setGauge(metricsKeys.APP_UPTIME, uptimeSeconds, { service: 'backend' });
}, 10000);
