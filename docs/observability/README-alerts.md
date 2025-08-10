## Alerts
#### Using metrics aggregation across microservices (with Prometheus) and service specific logs
### State Monitoring Alerts
1. Service Uptime Alert
   Metric: app_uptime_seconds (gauge)
   Alert: Triggerred if the metric is missing or zero for more than 1 minute (service crash or restart).
   Importance: Quickly detects if any microservice is down or has restarted unexpectedly.
2. Email Delivery Failure Rate
   Metrics: confirmation_emails_total, unsubscribed_emails_total, weather_update_emails_total (Prometheus Counter, label: success=false)
   Alert: If the failure rate for email operations exceeds 5% over the last 10 minutes.
   Importance: High failure rates may indicate provider external issues or bugs.
3. Queue Processing Latency
   Metric: queue_consumer_duration (histogram)
   Alert: 95th percentile processing time is greater than 2 seconds for 5 minutes.
   Importance: High latency can cause delays in notifications and signal downstream issues.
4. Queue Job Consumption Drop
   Metric: jobs_consumed_total (counter)
   Alert: No new jobs consumed for a given queue/event in the last 10 minutes.
   Importance: Indicates stuck consumers or upstream failures (potentially RabbitMQ issues).
5. Error Log Rate
   Log Level: error
   Alert: More than 10 error log messages per minute per service.
   Importance: Captures unexpected failures, such as unhandled exceptions or integration errors (external providers not available).
6. Warning Log Rate
   Log Level: warn
   Alert: More than 20 warning log messages in 10 minutes.
   Importance: Warnings can show suspicious actions such as failing subscription retries which could be bot activity. Also, it could indicate issues with a specific external provider that fails too often.
7. Cache Hit Rate Correlation (Weather Service)
   Metric: weather_cache_hit_ratio (gauge or counter)
   Alert: Alert if cache hit rate drops significantly while weather data request volume remains high.
   Importance: A low cache hit rate can indicate cache misconfiguration or backend issues, as well as intentional attempts to overload the system by requesting data for non-existing locations. This can lead to increased latency and load on external weather providers (too many external API requests).
### Business Logic Alerts
1. New Subscriptions Created
   Metric: subscriptions_created_total (counter)
   Alert: If the number of new subscriptions drops below a certain threshold.
   Why: A sudden drop may indicate frontend issues, marketing problems, or a broken subscription flow.
2. Confirmed Subscriptions
   Metric: subscriptions_confirmed_total (counter)
   Alert: If the ratio of confirmed to created subscriptions falls below a healthy threshold (e.g. <70% confirmation rate in 24h).
   Why: A low confirmation rate could mean email delivery issues, spam filtering, or an issue with confirmation process.
3. Canceled Subscriptions
   Metric: subscriptions_canceled_total (counter)
   Alert: If the number of cancellations spikes (e.g., more than 10% of active users in a day) or is unusually high compared to new/confirmed subscriptions.
   Why: A spike in cancellations may indicate user dissatisfaction, unwanted emails, or a bug causing accidental unsubscriptions.
4. Drop in /api/weather Requests
   Metric: weather_api_requests_total (counter)
   Alert: Alert if the number of /api/weather requests drops sharply compared to historical averages (e.g., >50% drop compared to previous day/hour).
   Why: A sudden drop may mean clients who use our API are not receiving expected data.