# ADR-005: Transitioning to Microservice Architecture: Updated plan

**Status:** Accepted <br>
**Date:** 2025-07-30 <br>
**Author:** VfourTwenty

## Context
A previous approach to microservice migration was reconsidered (see [ADR-004](ADR-004-TransitioningToMicroserviceArchitecture.md)), which involved separating out Subscription, Weather and Email units as separate services. However, after further analysis and practical experience, this approach was found to limit the benefits of service separation as it did not provide the desired separation of concerns and low coupling between services.
## Decision
We will transition from a monolithic architecture to a microservice-based architecture by refactoring the following modules into independent services and providing APIs for their communication:

### Identified Microservices

| Microservice         | Main Logic                                                                 | Communication Type |
|----------------------|----------------------------------------------------------------------------|--------------------|
| Frontend             | User interface and proxy forwarding                                        | Http               |
| Backend              | Business logic aggregation and request delegation (use-case orchestration) | Http               |
| Weather Service      | Weather data processing and caching                                        | Http               |
| Email Service        | Sending emails                                                             | Http               |
| Subscription Service | Managing user subscriptions                                                | Http               |

### Microservice diagram:
![](../Diagrams/Microservices.svg)


#### Separation of Core Logic and Business Concerns

- **Backend (API + business logic)**: <br>
Core Responsibility: Aggregates business logic from several services and handles request/response orchestration. For example, the backend’s use cases (see microservices/backend/src/application/use-cases/) coordinate between the Subscription Service, Email Service, and Weather Service to implement flows such as subscribing a user, unsubscribing, confirming a subscription, and sending weather update emails. This aggregation ensures that complex workflows are managed centrally, while individual services remain focused on their domains.

- **Weather Service**:
Core Responsibility: Provides weather data via a simple API. It does not decide when or why to fetch certain data, nor does it aggregate or process data for business use cases.
Business Logic: Orchestration, aggregation, and decision-making about which weather data to fetch and how to use is handled in the corresponding Backend use-cases. This ensures the Weather Service remains focused and reusable.

- **Email Service**: <br>
Core Responsibilities: Accepts receiver, subject, and content, and sends the email using one of the available external providers. It does not handle business-specific logic such as which template to use or when to send which type of email.
All logic for generating email content (e.g., confirmation, unsubscribe, weather update emails) and deciding when to send which email should reside in the Backend use-cases. This keeps the Email Service simple, reusable, and easy to scale.

- **Subscription Service**: <br>
Core Responsibility: Manages subscriptions, including all CRUD operations on the database table.
Database Ownership: The Subscription Service uses its own database (database-per-service pattern). No other services access this database.
Separation of Concerns: The Subscription Service is focused solely on subscription management, ensuring clear boundaries and maintainability.

### Communication Patterns

- **Synchronous Http:**
  HTTP was chosen as the primary communication protocol between services because it is simple, widely supported, and satisfies the current requirements for synchronous request/response interactions. This approach allows for straightforward service integration and debugging, and is well-suited for the current scale and complexity of the system.
## Consequences

**Benefits:**
- Each service can be developed, deployed, and scaled independently.
- Improved maintainability and fault isolation.
- Easier to adopt new technologies or update individual services.
- Clear separation of concerns: microservices focus on their specific narrow responsibilities, while business logic is aggregated in one place.

**Trade-offs:**
- More complex setup for networking, configuration, data handling and consistency.

## Alternatives Considered
- **Remain Monolithic:**
  Rejected due to scaling and maintainability limitations.
- **Modular Monolith:**
  Considered, but does not provide the same level of independence and scalability as microservices.
- **Mixing business logic in microservices:**
  Rejected to avoid tight coupling and to leverage individual service simplicity by keeping them focused on their knowledge domains.



