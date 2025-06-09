## ADR Topic: Separating Route Controllers from Route Definitions

**Status:** Accepted  
**Date:** 2025-06-08

### Context

Currently, route handlers are defined as inline functions directly inside route definition files.  
While this is fast for prototyping, it leads to:
- Bloated routing files
- Difficulties in testing logic independently
- Poor separation of concerns
- Limited scalability

We want to consider separating the route logic into dedicated controller modules.

**Goals:**
- Improve code organization for better testing and scaling

---

### Considered Options

#### 🔹 Option 1: Move all route handlers to `controllers/` folder

Each route handler is moved into a logically named controller file (e.g., `subscriptionController.js`, `weatherController.js`) and then imported into the route file.

**Example:**
```js
// routes/subscription.js
const { handleSubscribe } = require('../controllers/subscriptionController');
router.post('/subscribe', handleSubscribe);
```
**Pros:**
- Clear separation of responsibilities (routing vs business logic)
- Easier to test
- Scales well
- Easier to apply decorators like logging, validation, etc.

**Cons:**
- More imports

---

#### 🔹 Option 2: Inline route handlers (status quo)

Define all logic inside route declarations.

**Pros:**
- Fast and simple for small projects
- No file jumping

**Cons:**
- Poor testability
- Messy files as app grows
- Hard to refactor or share

---

### Decision

**Option 1.** We will create a separate `controllers` module and use the logic via imports in routes.
