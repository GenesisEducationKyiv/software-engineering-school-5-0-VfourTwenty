### Changes made:

- Moved source code folders to a new src/ directory
- Put all db related code in a new db/ folder inside src/
- Separated db config from other configurations [(see ADR-001)](ADR/ADR-001-EnvironmentConfig.md)
- Implemented dependency inversion by creating provider interfaces 
and abstracting external dependencies [(see ADR-002)](ADR/ADR-002-ExternalDependencies.md)
- Separated controllers and routes [(see ADR-003)](ADR/ADR-003-RoutingAndLogic.md)
- Separated cron jobs into a new folder and now only cronMain function that aggregates all jobs is exposed for scheduling
- Separated email templates out for better modularity
- Created a new layer of abstraction - services (weather, email, subscription) that expose necessary business logic functions without relaying on specific implementations


#### SOLID Principles Applied:
1. **Single Responsibility Principle (SRP)**

    - Separation of controllers, routes, cron jobs, services, and email templates.

    - Each module now has one reason to change.

2. **Open/Closed Principle (OCP)**

    - Use of provider interfaces and abstracted services.

    - It is now easier add new email/DB/weather providers without changing the existing logic.

3. **Liskov Substitution Principle (LSP)**

    - Specific provider implementations conform to the base interfaces.

4. **Interface Segregation Principle (ISP)**

    - Modules only depend on what they use.

5. **Dependency Inversion Principle (DIP)**

    - Interfaces and abstracted external dependencies.

    - Core logic depends on abstractions, not implementations.


#### GRASP Principles Applied:
1. **Controller**

    - Separation of controllers from routes.

    - Controllers now act as coordinators, handling system-level events.

2. **Information Expert**

    - Weather, Email and Subscription services.

    - Each one holds and uses the knowledge it needs.

3. **Creator**

    - Encapsulating object creation in appropriate places (e.g., subscriptionService handles CRUD operations, emailService creates emails).

4. **Low Coupling**

    - Abstracting DB access and email related configs.

    - Minimal dependencies between modules.

5. **High Cohesion**

    - Organization by responsibility.

    - Related behavior is grouped together for maintainability (services/, utils/).

6. **Indirection**

    - The new service layer.

    - Indirection is added to reduce coupling between the route/controller layer and infrastructure details.


**A note on services:**
This structure works well and complies with the core principles assuming that the PostgresSQL provider is stable and will continue to be used. There are 3 tables stored in the database and right now abstraction is only provided for the "Subscriptions" table. Refactoring steps would be needed depending on the alternatives for db providers.


**Updated code diagram:**
![containers.svg](C4-model/code-upgr1.svg)
