# 🌤️ SkyFetch – System Design Document

## Table of Contents

- [1. Overview](#1-overview)
- [2. Requirements](#2-requirements)
- [3. Architecture](#3-architecture)
    - [3.1 System Components](#31-system-components)
    - [3.2 System Diagram](#32-system-diagram)
    - [3.3 Modules](#33-modules)
    - [3.4 Data Flow](#34-data-flow-)
- [4. API Design](#4-api-design)
- [5. Database Design](#5-database-design)
- [6. External Dependencies](#6-external-dependencies)
- [7. Scalability & Limitations](#7-scalability--limitations)


## 1. Overview

**SkyFetch** is a lightweight weather subscription API service that allows users to receive hourly or daily weather updates in the city of choice via email. Built with **Node.js**, **PostgreSQL**, and **Sequelize**, it fetches weather data from `Weather.API.com` and supports easy deployment with or without Docker. The frontend is served via the same backend server for simplicity.

---

## 2. Requirements

### Functional

- Provide realtime weather updates to subscribers
- Support hourly and daily update frequencies
- Must be free/very cheap to maintain
- Ensure secure data handling
- Support growth to a few thousand users with minimal infrastructure changes

### Non-Functional

- Scalability: functionality and storage should be easy to grow with support for reverting changes
- Availability: service should be up 99.9% of time
- Performance: the app should be able to fetch and distribute most recent weather updates to the current number of subscribers
- Reliability: make sure emails get delivered and sub status gets updated properly
- Security: ensure safe subscription and confirmation procedures, especially in terms of token handling

---

## 3. Architecture

### 3.1 System Components

- **Frontend (served statically)**: Subscription form, confirmation, subscription cancelation, and error pages
- **Backend  (Node.js + Express)**:
    - **API**: exposed to requests
    - **Logic**: functions for app's business logic
    - **Scheduler**: Sends daily/hourly emails
- **Database (PostgreSQL)**:
    - Stores subscription and weather info
- **External Services**:
    - `WeatherAPI.com` – weather data provider
    - `Resend` - sends emails
    - `Render` - app hosting

### 3.2 System Diagram
![containers.svg](../C4-model/containers.svg)
<br>
[See the whole C4 model](../C4-model/)

---

### 3.3 Modules

- Routes
    - public.js - html pages
    - weather.js - fetch weather data
    - subscription.js - sub management
- Models (database interaction)
    - weather.js
    - subscription.js
    - citysubtracker.js
- Public
    - subscribe.html
    - confirmed.html
    - unsubscribed.html
    - error.html
- Utils
    - mailer.js (exports sendConfirmationEmail, sendUnsubscribeEmail, sendUpdates)
    - fetchweather.js (exports fetchHourlyWeather, fetchDailyWeather)
    - subtracker.js (exports incrementCityCounter, decrementCityCounter)
- Config
    - config.js - environment setup

---

### 3.4 Data Flow 

1. User visits subscription page `GET /` and fill out the form
2. The form is checked
3. If valid, an email with confirm link is sent
4. User visits confirm link `GET /confirm/:token`
5. Public route controller sends a request to `POST /api/confirm/:token`
6. If token is valid, and sub was not confirmed previously, user sees `confirmed.html` and starts receiving updates
7. If confirmation fails, user sees `error.html` with an error message
8. Updates emails include an unsubscribe link `GET /unsubscribe/:token`
9. When user clicks the unsubscribe link, public route controller sends a request to `POST /api/unsubscribe/:token`
10. If token is valid, and sub was previously confirmed, user sees `unsubscribed.html` and stops receiving updates
11. Otherwise, user sees `error.html` with an error message

---

## 4. API Design

| Endpoint                  | Method | Description                                       |
|---------------------------|--------|---------------------------------------------------|
| `/api/weather`            | GET    | Get most recent weather updates in specified city |
| `/api/subscribe`          | POST   | Create a subscription for valid credentials       |
| `/api/confirm/:token`     | POST   | Confirms subscription via valid token             |
| `/api/unsubscribe/:token` | POST   | Unsubscribes user with a valid token              |


---

## 5. Database Design

### Tables

- `Subscription`
    - `id`, `email`, `frequency` (hourly/daily), `confirmed` (true/false), `token`, `createdAt`

- `WeatherData` 
    - `city`, `temperature`, `humidity`, `description`, `fetchedAt` 

- `WeatherCity`
    - `city`, `hourly_count`, `daily_count`

 Migrations handled via Sequelize CLI.

---

## 6. External Dependencies

| Dependency       | Purpose             |
|------------------|---------------------|
| Weather.API.com  | Weather data source |
| Resend           | Sending emails      |
| PostgreSQL       | Data storage        |

---

## 7. Scalability & Limitations

### Currently

- Designed for free-tier usage 
- Questionable config setup (see ADR-001)
- Singular point of failure risk with using onw provider per external service (see ADR-002)
- Routing controllers are defined inline - not good for scaling (see ADR-003)

### Future Improvements

- Research alternative free/close to free external providers
- Clear config setup
- Separate out controller logic 
- Implement a provider pattern or use a centralized Service module for interacting with external dependencies
- Implement timezone consideration for subscribers
- Add snapshot and revert features for the db
- Improve data workflow, specifically for request failures during confirmation and sub cancellation