const IMetricsProvider = require('../metricsProviderInterface');
const { promClient, register } = require('./promClient');

class PromMetricsProvider extends IMetricsProvider 
{
    constructor() 
    {
        super();
        this.client = promClient;
        this.register = register;
        this.metrics = {}; // Store metrics by name
    }

    registerMetric(type, name, help, options = {}) 
    {
        if (this.metrics[name]) return; // Already registered

        let metric;
        switch (type) 
        {
            case 'counter':
                metric = new this.client.Counter({ name, help, ...options });
                break;
            case 'gauge':
                metric = new this.client.Gauge({ name, help, ...options });
                break;
            case 'histogram':
                metric = new this.client.Histogram({ name, help, ...options });
                break;
            default:
                throw new Error(`Unknown metric type: ${type}`);
        }
        this.metrics[name] = metric;
        this.register.registerMetric(metric);
    }

    incrementCounter(name, value = 1, labels) 
    {
        if (!this.metrics[name]) throw new Error(`Counter ${name} not registered`);
        this.metrics[name].inc(labels, value);
    }

    setGauge(name, value, labels) 
    {
        if (!this.metrics[name]) throw new Error(`Gauge ${name} not registered`);
        this.metrics[name].set(labels, value);
    }

    observeHistogram(name, value, labels) 
    {
        if (!this.metrics[name]) throw new Error(`Histogram ${name} not registered`);
        this.metrics[name].observe(labels, value);
    }

    getRegister() 
    {
        return this.register;
    }
}

module.exports = PromMetricsProvider;
