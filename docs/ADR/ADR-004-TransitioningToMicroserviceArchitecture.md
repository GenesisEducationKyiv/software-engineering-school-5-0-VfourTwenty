# ADR-004: Transitioning to Microservice Architecture

**Status:** Proposed <br>
**Date:** 2025-07-04 <br>
**Author:** VfourTwenty

## Context
The current application is structured as a monolith, containing several distinct domains:
- Subscription management
- Weather data processing
- Email delivery

As the application grows, the following challenges may emerge:
- Difficulty in scaling specific parts of the system independently (e.g., weather data processing may require more resources than subscription management).
- Tight coupling between modules, making maintenance and deployment more complex.
- The need for improved fault isolation and the ability to update or redeploy services independently.
- Mixing of business logic (e.g., email templating, weather aggregation) with core delivery/data-fetching logic, making services less reusable and harder to maintain.

## Decision
We will transition from a monolithic architecture to a microservice-based architecture by extracting the following modules into independent services:

### Identified Microservices

| Microservice         | Main Logic                   | Communication Type       |
|----------------------|-----------------------------|--------------------------|
| Weather Service      | Weather data processing and storage | REST API (HTTP/gRPC)     |
| Email Service        | Sending email notifications  | Message Queue (RabbitMQ) |
| Subscription Service | Managing user subscriptions  | REST API (HTTP/gRPC)     |

#### Separation of Core Logic and Business Concerns

- **Weather Service:**
  - **Core Responsibility:** Provides weather data via a simple API. It does not decide when or why to fetch certain data, nor does it aggregate or process data for business use cases.
  - **Business Logic:** Orchestration, aggregation, and decision-making about which weather data to fetch and how to use it should be handled by a separate orchestration or domain service. This ensures the Weather Service remains focused and reusable.

- **Email Service:**
  - **Core Responsibilities:** Accepts receiver, subject, and content, and sends the email using one of the available external providers. It does not handle business-specific logic such as which template to use or when to send which type of email.
  - **Business Logic:** All logic for generating email content (e.g., confirmation, unsubscribe, weather update emails) and deciding when to send which email should reside in the relevant business/domain service (e.g., Subscription Service, Weather Orchestrator). This keeps the Email Service simple, reusable, and easy to scale.

- **Subscription Service:**
  - **Core Responsibility:** Manages subscriptions, including all CRUD operations on the database table. 
  - **Database Ownership:** The Subscription Service uses its own database (database-per-service pattern). Other services do not access this database.
  - **Separation of Concerns:** The Subscription Service is focused solely on subscription management, ensuring clear boundaries and maintainability. It does not handle business logic.

### Communication Patterns

- **Synchronous (REST/gRPC):**
  Used for operations requiring immediate response, such as fetching weather data and CRUD operations on the Subscriptions database table.

- **Asynchronous (Message Queue):**
  Used for operations that can be processed in the background, such as sending emails after a subscription event.

## Consequences

**Benefits:**
- Each service can be developed, deployed, and scaled independently.
- Improved maintainability and fault isolation.
- Easier to adopt new technologies or update individual services.
- Clear separation of concerns: microservices focus on delivery/data, while business logic lives in domain/application layers.

**Trade-offs:**
- Increased operational complexity (service discovery, monitoring, deployment).
- Need for robust inter-service communication and error handling.
- Potential for data consistency challenges across services.

## Alternatives Considered
- **Remain Monolithic:**
  Rejected due to scaling and maintainability limitations.
- **Modular Monolith:**
  Considered, but does not provide the same level of independence and scalability as microservices.
- **Mixing business logic in microservices:**
  Rejected to avoid tight coupling and to keep services reusable and focused on core responsibilities.

