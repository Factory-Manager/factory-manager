# core-rest-service

REST API service for the Factory Manager project.

It handles users, authentication, factory areas, machines, machine state and telemetry storage.
The Web GUI uses it as the main HTTP API, while the Coordinator uses it to store telemetry and update machine states.

The service does not consume MQTT messages directly — MQTT events are handled by the Coordinator.

## Requirements

- Node.js and npm — see the pinned versions in [`Dockerfile`](./Dockerfile) and `package.json` (`engines`)
- MongoDB 8

## Setup

```bash
cp .env.example .env
npm ci
```

Required variables:

```env
MONGO_URI=mongodb://localhost:27017/factory-manager
JWT_SECRET=change-me-with-a-long-secret
```

See `.env.example` for the full list of optional variables. `SERVICE_TOKEN` is used by the Coordinator for internal calls.

## Local infrastructure

From the repository root:

```bash
docker compose up -d        # full stack
docker compose up -d mongo  # only MongoDB
```

## Run

```bash
npm run dev    # development, with nodemon
npm start      # normal start
```

Runs on `http://localhost:3000` by default.

## API documentation

Interactive docs at `/api/docs`. The OpenAPI spec lives in `docs/openapi.yaml` — validate it with `npm run docs:validate`.

## Seed admin user

```bash
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=Admin123! \
ADMIN_FIRST_NAME=System \
ADMIN_LAST_NAME=Admin \
ADMIN_PHONE_PREFIX=+39 \
ADMIN_PHONE_NUMBER=3334567890 \
npm run seed:admin
```

If an admin user already exists, the script prompts to update it with the current environment variables.

## Authentication

User endpoints use JWT:

```
Authorization: Bearer <token>
```

Internal Coordinator calls use the service token:

```
X-Service-Token: <coordinator-service-token>
```

## Notes

Telemetry creation and machine-state updates are separate operations. The Coordinator stores telemetry through `POST /api/telemetry` and updates machine state through `PATCH /api/machines/:id/state`.

Duplicate telemetry events are detected through `eventId` and return `409 Conflict`, so the Coordinator can safely handle retries.
