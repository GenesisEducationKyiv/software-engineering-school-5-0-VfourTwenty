class IMetricsProvider
{
    /**
     * @param {string} type - counter, gauge, etc
     * @param {string} name
     * @param {string} help
     * @param {object} [options] - Additional options (labels, etc.)
     */
    registerMetric(type, name, help, options) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} name
     * @param {number} [value=1]
     * @param {object} [labels]
     */
    incrementCounter(name, value = 1, labels) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} name
     * @param {number} value
     * @param {object} [labels]
     */
    setGauge(name, value, labels) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} name
     * @param {number} value
     * @param {object} [labels]
     */
    observeHistogram(name, value, labels) 
    {
        throw new Error('Not implemented');
    }

    /**
     * Get the implementation registry
     */
    getRegister()
    {
        throw new Error('Not implemented');
    }
}

module.exports = IMetricsProvider;
