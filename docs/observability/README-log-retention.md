## Log Retention Policy
### Log Types
**Error Logs:** Critical errors, exceptions, failed operations. <br>
**Warning Logs:** Potential issues, degraded operations. <br>
**Info Logs:** Normal operation flow and business events. <br>
**Debug Logs:** Debugging/dev details. 
### Retention Periods
**Error Logs:** Retain for 90 days
Why: Error logs are essential for tracking and analyzing recurring or critical issues. Keeping them for 3 months allows for thorough investigation and reporting.
**Warning Logs:** Retain for 30 days
Why: Warnings help identify trends and early signs of problems. A month should be enough to spot and address recurring warnings.
**Info Logs:** Retain for 10 days
Why: Info logs show the flow of technical operations in the context of business logic (aka user subscribed/unsubscribed). This data can be useful in short-term debugging context together with other log levels, but storing it for too long may clutter storage. 
**Debug Logs:** Retain for 5 days
Why: These logs are high-volume and mainly used for short-term troubleshooting. Keeping them for this period balances storage needs and operational usefulness.
### Deletion & Archival
**Automatic Deletion:**
Log rotation tools (e.g. logrotate for Linux or Docker log options) can be used to automatically remove logs older than the specified retention period.
**Archival:**
For compliance or audit purposes, error logs can be archived to cold storage (e.g. AWS S3, Google Cloud Storage) after 90 days, and deleted after 1 year.
### Why This Policy?
Balances storage cost and troubleshooting needs.
Longer retention for errors ensures possibility to investigate and report on critical incidents.
Shorter retention for info/debug keeps storage manageable and focuses on recent operational issues.
Archival is optional but recommended for regulated environments where audits may be conducted regularly.
### Final note:
The amount of logs stored and the retention periods will be customized based on project’s budget and requirements. It may not be feasible to store error logs for 3 months or to implement archival due to storage costs or infrastructure limitations, therefore this strategy as well as the logging setup itself should be tailored before releasing the product.