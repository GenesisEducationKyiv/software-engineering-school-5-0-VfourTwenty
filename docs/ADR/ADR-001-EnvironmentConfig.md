## ADR Topic: Environment Configuration Separation ##

**Status:** Proposed  
**Date:** 2025-06-08  
**Author:** VfourTwenty

### Context:

The current config.js file handles both:
- Database-related environment variables
- Application-level configuration like the base URL for email link construction.

Also, the variable naming is confusing for somebody new to the project.

This mixes infrastructure concerns (database setup) with application behavior (routing/email content), which complicates scalability, testing, and clarity.

### Considered Options: ###

#### 1. Split config into config/db.js and config/app.js

**Pros:**

- Clear separation of concerns
- Easier to test or mock specific areas (e.g., use a fake DB config in testing)
- Avoids loading unnecessary env vars which also ensures better security
- No need to edit old files when a new module needs a new config setup

**Cons:**

- More files and import statements
- Need to redefine config skeleton for each responsibility

---

#### 2. Use a .env loader per module (e.g., dotenv-flow or separate .env.db, .env.app)

**Pros:**

- Uses environment files to scope configs
- Can even switch behavior per environment more granularly

**Cons:**

- Also, more files but on the .env side
- Harder to manage .env.* files, can be problematic on deployment platforms

---

#### 3. Keep a monolithic config.js but group logically (e.g., config.db, config.email)

**Pros:**

- Minimal change
- Central place for all configuration

**Cons:**

- Still mixes concerns
- Doesn't scale well if the app grows

---

#### 4. Keep the same one file config.js but in .env explicitly name database variables like "DB_USER" instead of "username"

**Pros:**

- Minimal change
- Central place for all configuration

**Cons:**

- Still mixes concerns
- Doesn't scale well if the app grows

---

### Decision: ###
Pending
