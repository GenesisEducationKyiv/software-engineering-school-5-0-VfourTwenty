const IMetricsProvider = require('../../../src/common/metrics/metricsProviderInterface');

class MetricsProviderMock extends IMetricsProvider
{
    constructor()
    {
        super();
        this.metrics = {};
    }

    registerMetric(type, name, help)
    {
        // supports just counters for now, mock can be extended/modified if needed
        this.metrics[name] = 0;
    }

    incrementCounter(name)
    {
        this.metrics[name] ++;
    }

    reset()
    {
        Object.keys(this.metrics).forEach(name =>
        {
            this.metrics[name] = 0;
        });
    }
}

module.exports = MetricsProviderMock;
