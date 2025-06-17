## ADR Topic: Abstracting External Dependencies

**Status:** Proposed  
**Date:** 2025-06-09 <br>
**Author:** VfourTwenty

### Context

SkyFetch relies on multiple third-party services:
- Weather API (forecast data)
- Resend (email delivery)
- Render (PostgreSQL database)

These represent single points of failure. If one goes down, critical app functions break.  
To mitigate this, we're designing an abstraction layer using the provider pattern and planning to support automated failover based on service health.

**Goals:**
- Abstract third-party providers behind interfaces
- Support multiple interchangeable providers per service type
- Implement health checks + automatic failover
- Enable easy mocking for testing

---

### Considered Options

#### 🔹 Option 1: Provider Interface + Adapter Pattern + Health Check Monitoring

Each dependency type gets:
- A common interface (e.g. `IEmailProvider`, `IWeatherProvider`)
- One or more concrete implementations (`ResendProvider`, `MailgunProvider`, etc.)
- A health checker that pings providers periodically
- An orchestrator that swaps providers on failure

Example:
```js
class EmailService 
{
  constructor(providers) { this.providers = providers; this.active = providers[0]; }
  async send(email) { return this.active.send(email); }
  async checkHealth() 
  {
    for (const provider of this.providers) 
    {
      if (await provider.isHealthy()) 
      {
        this.active = provider;
        break;
      }
    }
  }
} 
```
- A cron job or `setInterval` monitors each provider’s health and logs switches
- Could be extended to notify admins or fallback to offline mode

**Pros:**
- Robust & scalable
- Automates provider switching
- Prepares the system for enterprise scaling

**Cons:**
- Requires custom logic and orchestration
- Higher complexity
- Logs must track failover behavior for debugging

---

#### 🔹 Option 2: Centralized Service Wrapper with Manual Switching

A `services.js` exports utility functions (`sendEmail`, `getForecast`) that internally use a primary provider.  
Switching requires code changes or config reloads.

**Pros:**
- Simple to implement
- All third-party logic centralized

**Cons:**
- No automated failover
- Code changes required to switch providers
- Limited test flexibility

---

#### 🔹 Option 3: Direct Use (status quo)

Use third-party SDKs or APIs inline in business logic.

**Pros:**
- Minimum setup
- Fast for prototypes

**Cons:**
- High coupling
- Hard to test, replace, or maintain
- Current options will soon expire

---

### Decision

**Option 1** has been implemented. Now, instead of calling weather and email providers 
directly, app will use functions exposed by the corresponding service (weatherService, emailService, subscriptionService).
To create a provider standard, interface IProvider has been implemented. Then IWeatherProvider and IEmailProvider inherit from it
and expose function signatures to be implemented in specific providers (currently WeatherApi.com and Resend).
All implementations of IProvider have a ping() method that will be used for health checks via cron jobs. Orchestration will be performed by shared state.js
file that now stores currently active provider for each external service. 
