# ADR-006: Integrating a Message Broker into the new Microservice Setup

**Status:** Accepted <br>
**Date:** 2025-08-01 <br>
**Author:** VfourTwenty

## Context
As described in [ADR-005](ADR-005-TransitioningToMicroserviceArchitecture-UPD.md), the system was refactored into independent microservices communicating synchronously over HTTP, with the Backend aggregating business logic and orchestrating workflows. However, as the system evolves, several limitations of purely synchronous communication become apparent:
Notification logic (e.g., sending confirmation, unsubscribe, and weather update emails) was tightly coupled to synchronous flows and limited to emails only.
There was a need for more robust, scalable, and decoupled event-driven workflows for asynchronous tasks as notifications.
To address these issues, we decided to introduce a message broker (RabbitMQ) to enable event-driven communication between services.
## Decision
We will integrate a message broker RabbitMQ into the microservice architecture to support asynchronous, event-driven communication. This will involve the following changes:
### Service Responsibilities and Event Flows
- **Backend (reverse proxy + update scheduling)**:
Continues to act as an API gateway and request delegator, but no longer handles email logic directly. Instead, it emits weather updates events to the message broker as appropriate.
- **Notification Service**:
A new service that subscribes to relevant events from the message broker and handles all notification logic (sending subscription and weather related notifications). It calls the Email Service to deliver notifications via email.
- **Subscription Service**:
  Emits subscription related events (SubscriptionCreated, SubscriptionConfirmed, UserUnsubscribed) to the message broker when relevant actions occur.
- **Weather Service**:
Remains focused on providing weather data, as before.
- **Email Service**:
  Remains focused on sending emails, as before.
Communication Patterns
- **Synchronous Http:**
Used for direct, immediate operations (subscriptions CRUD, data fetches, sending emails).
- **Asynchronous Message Broker**:
Used for all business events and notifications, enabling decoupled and scalable workflows.
### Updated Microservice Diagram
![](../Diagrams/Microservices-upd.svg)
## Consequences
**Benefits:**
Decouples asynchronous notification logic from the Backend, improving modularity and maintainability.
Increases system resilience: events are queued and processed even if some services are temporarily unavailable.
Enables easier scaling of notification delivery logic (e.g. integrate with a messenger bot).
Lays the foundation for future event-driven features (e.g., analytics, additional notification channels).
**Trade-offs:**
Adds operational complexity (message broker setup, monitoring, error handling, message delivery guarantees).
Requires careful design of event schemas and idempotency handling in consumers.
## Alternatives Considered
- **Continue with synchronous HTTP only**:
Rejected due to lack of resilience for asynchronous workflows.
- **Direct service-to-service notification logic**:
Rejected to avoid duplicating notification logic and to keep services focused on their core knowledge domains.

