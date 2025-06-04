# SkyFetch – Weather API Subscription Service

A weather forecast subscription API with email notifications, built using Node.js (Express), PostgreSQL, and Resend.

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Database Usage](#database-usage)
- [Docker Support](#docker-support)
- [Subscription Logic](#subscription-logic)
- [Mailing Logic](#mailing-logic)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Hosting](#hosting)
- [Scripts](#scripts)

---

## API Endpoints

The following API endpoints are implemented:

### Weather API

- `GET /weather`  
  Get current weather for a city

### Subscription Management API

- `POST /subscribe`  
  Subscribe to weather updates

- `GET /confirm/:token`  
  Confirm email subscription

- `GET /unsubscribe/:token`  
  Unsubscribe from weather updates

These routes are prefixed with /api.
There are also public routes (homepage, `/confirm/:token`, `/unsubscribe/:token`) that render the corresponding HTML pages.
Homepage is the UI entry point available at /. Confirmation and unsubscription pages are only available with a valid token received in emails. There is also a fallback page: error.html.

---

## Database Usage

- PostgreSQL is used with Sequelize ORM.
- The `WeatherCity` table tracks subscription count by city and frequency, used to optimize forecast fetching.
- The `WeatherData` table holds the most recent forecast fetch per city.
- The `Subscriptions` table holds user data: email, city, frequency, and token.
- Migrations are automatically run when the app starts (via the `npm start` script).  
    You can also run them manually using:
    ```bash```
    npm run migrate

---

## Docker Support

✅ Fully tested with:

- Docker Engine (Linux)
- Docker Desktop (Windows)

To run:

```bash```
docker compose up --build

---

## Subscription Logic

- One email cannot subscribe twice for the same city and frequency. A message is shown accordingly on the subscription page.
- To eliminate invalid subscriptions, a test request is sent to WeatherAPI. If the location is invalid, an error message is shown and the subscription is rejected.

---

## Mailing Logic

- Upon subscription confirmation, a `WeatherCity` entry in the database is updated. If it's a new city (with 0 previous subscribers), a new entry is added, and the appropriate counter (hourly/daily) is incremented.
- On unsubscription, the counter is decremented. If both counters reach 0, the entry is removed entirely.
- Weather is fetched hourly for cities with `hourlySubscribers > 0`. Forecast is cached in the `WeatherData` table, overwriting previous entries (only 1 row per city).
- After caching, hourly updates are sent using the stored forecast via cron.
- For daily updates, the hourly cache is reused when possible. Otherwise, daily fetcher pulls missing data for cities with `dailySubscribers > 0` and `hourlySubscribers = 0`.

A timeout is used in the mailing process to work around resend request limits.

---

## Environment Configuration

- Environment separation is handled using different configuration methods:
    - **Production** uses a `.env` file for sensitive environment variables.
    - **Development** and **Test** environments use values defined in the `config` directory (`config/config.js` with `NODE_ENV` detection).

    - ⚠️ **Security Note**: This project includes API keys directly in `docker-compose.yml` for simplicity and convenience. In real world apps API keys should not be pushed to github ;)


## Testing

Tests cover:

- **Weather API**
    - City validation
    - Forecast retrieval
- **Subscription Management API**
    - New subscriptions
    - Token-based confirmation/unsubscription
    - Duplicate prevention

Tests run in a separate environment and database using:

```bash```
npm test

---

## Hosting

🌐 The app is also hosted on [Render](https://weatherapi-backend-z94f.onrender.com) for demo purposes (it does spin down due to free plan being used).

---

## Scripts

- Debug scripts are available in `scripts/debug` to view:
    - Whole tables
    - Individual entries
- A seeder script is available at `scripts/seeder` to populate or clear tables. You should enter at least one valid email address to subscribe for updates. Also, you can enter cities or frequency, or leave those default. You can confirm all newly generated subscriptions through the api in script immediately or later.
- Script usage:
    - without docker:
        - npm run debug (to see the usage)
        - npm run seed
    - for docker:
        - docker compose run --rm debug node scripts/debug.js (see the usage)
        - docker compose run --rm debug node scripts/seeder.js

