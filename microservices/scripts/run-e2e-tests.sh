#!/bin/bash
set -e

./create-db-if-needed.sh && \
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml up --build -d db subscription && sleep 7 && \
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml up --build -d frontend backend weather email test-e2e

echo "==== Tailing logs for test-e2e ===="
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml logs -f test-e2e

docker compose down --remove-orphans