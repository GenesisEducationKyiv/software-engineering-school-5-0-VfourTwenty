const IMetricsProvider = require('../../src/common/metrics/metricsProviderInterface');

class MetricsProviderMock extends IMetricsProvider
{
    registerMetric(type, name, help)
    {

    }

    incrementCounter(name)
    {

    }

    reset()
    {

    }
}

module.exports = MetricsProviderMock;
