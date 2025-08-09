const METRIC_KEYS = {
    HTTP_REQUESTS_TOTAL: 'http_requests_total',
    HTTP_REQUEST_DURATION: 'http_request_duration_seconds',
    HTTP_REQUEST_ERRORS: 'http_request_errors_total',

    SUBSCRIPTIONS_CREATED_TOTAL: 'subscriptions_created_total',
    SUBSCRIPTIONS_CONFIRMED_TOTAL: 'subscriptions_confirmed_total',
    SUBSCRIPTIONS_CANCELED_TOTAL: 'subscriptions_canceled_total',

    APP_UPTIME: 'app_uptime_seconds',

    DB_QUERY_DURATION: 'db_query_duration_seconds',
    DB_QUERY_ERRORS: 'db_query_errors_total',
};

module.exports = METRIC_KEYS;
