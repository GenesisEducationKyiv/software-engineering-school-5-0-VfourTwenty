#!/bin/bash
set -e

DB_NAME=${1:-subscription_db}
DB_USER=${2:-postgres}
DB_SERVICE=${3:-db}
COMPOSE_FILE=${4:-../docker-compose.yml}

# Use 'docker compose' if available, else fallback to 'docker-compose'
if command -v docker compose &> /dev/null; then
  DC="docker compose"
else
  DC="docker-compose"
fi

echo "Ensuring $DB_SERVICE service is running using $COMPOSE_FILE..."
$DC -f "$COMPOSE_FILE" up -d "$DB_SERVICE"

echo "Waiting for $DB_SERVICE to be ready..."
until $DC -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" pg_isready -U "$DB_USER" > /dev/null 2>&1; do
  sleep 1
done

echo "Checking if database '$DB_NAME' exists..."
if $DC -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" psql -U "$DB_USER" -d postgres -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" | grep -q "1"; then
  echo "Database '$DB_NAME' already exists."
else
  echo "Creating database '$DB_NAME'..."
  $DC -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
fi