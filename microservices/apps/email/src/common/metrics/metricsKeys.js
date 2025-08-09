const METRIC_KEYS = {
    HTTP_REQUESTS_TOTAL: 'http_requests_total',
    HTTP_REQUEST_DURATION: 'http_request_duration_seconds',
    HTTP_REQUEST_ERRORS: 'http_request_errors_total',

    EMAILS_SENT_TOTAL: 'emails_sent_total',
    EMAILS_FAILED_TOTAL: 'email_failed_total',

    EXTERNAL_API_CALLS: 'external_api_calls_total',

    APP_UPTIME: 'app_uptime_seconds',
};

module.exports = METRIC_KEYS;
