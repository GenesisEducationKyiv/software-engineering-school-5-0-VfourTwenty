#!/bin/bash
set -e

DB_NAME=${1:-weather_db_test}
DB_USER=${2:-postgres}
DB_SERVICE=${3:-db-test}
COMPOSE_FILE=${4:-docker-compose.test.yml}

# Start db service if not running
echo "Ensuring $DB_SERVICE service is running..."
docker compose -f $COMPOSE_FILE up -d $DB_SERVICE

# Wait for the db service to be ready
echo "Waiting for $DB_SERVICE to be ready..."
until docker compose -f $COMPOSE_FILE exec -T $DB_SERVICE pg_isready -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done

# Now check/create the database
echo "Checking if database '$DB_NAME' exists..."
docker compose -f $COMPOSE_FILE exec -T $DB_SERVICE psql -U $DB_USER -d postgres -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" | grep -q "1" \
  && echo "Database '$DB_NAME' already exists." \
  || (echo "Creating database '$DB_NAME'..." && docker compose -f $COMPOSE_FILE exec -T $DB_SERVICE psql -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;")