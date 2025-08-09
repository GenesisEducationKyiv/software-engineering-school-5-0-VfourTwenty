const metricsProvider = require('../../common/metrics/metricsSetup');
const METRIC_KEYS = require('../../common/metrics/metricsKeys');

function metricsMiddleware(req, res, next) {
    const start = process.hrtime();

    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;

        // Increment total requests
        metricsProvider.incrementCounter(METRIC_KEYS.HTTP_REQUESTS_TOTAL, 1, {
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        // Observe request duration
        metricsProvider.observeHistogram(METRIC_KEYS.HTTP_REQUEST_DURATION, durationInSeconds, {
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        // Increment error counter for 4xx/5xx
        if (res.statusCode >= 400)
        {
            metricsProvider.incrementCounter(METRIC_KEYS.HTTP_REQUEST_ERRORS, 1, {
                method: req.method,
                route: req.route ? req.route.path : req.path,
                status_code: res.statusCode
            });
        }
    });

    next();
}

module.exports = metricsMiddleware;