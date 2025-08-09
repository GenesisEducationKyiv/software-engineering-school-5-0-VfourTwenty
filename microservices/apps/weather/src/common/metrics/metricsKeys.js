const METRIC_KEYS = {
    WEATHER_CACHE_HITS: 'weatherCacheHits',
    WEATHER_CACHE_MISSES: 'weatherCacheMisses',

    HTTP_REQUESTS_TOTAL: 'http_requests_total',
    HTTP_REQUEST_DURATION: 'http_request_duration_seconds',
    HTTP_REQUEST_ERRORS: 'http_request_errors_total',

    EXTERNAL_API_CALLS: 'external_api_calls_total',

    APP_UPTIME: 'app_uptime_seconds',
};

module.exports = METRIC_KEYS;
