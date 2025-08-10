const express = require('express');
const app = express();
app.use(express.json());

const { register } = require('./src/common/metrics/prometheus/promClient');

const metricsProvider = require('./src/common/metrics/metricsSetup');
const metricsKeys = require('./src/common/metrics/metricsKeys');

app.get('/metrics', async (req, res) =>
{
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const PORT = process.env.PORT || 4009;
app.listen(PORT, () => 
{
    console.log(`Notification running on port ${PORT}`);
});

const startTime = Date.now();
setInterval(() =>
{
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    metricsProvider.setGauge(metricsKeys.APP_UPTIME, uptimeSeconds, { service: 'notification' });
}, 10000);

const { eventHandler, queueConsumer } = require('./setup');
const config = require('./src/common/config/index').queue;
queueConsumer.start(config.queueName, (msg) => eventHandler.handleEvent(msg));
