#!/bin/bash
set -e

./create-db-if-needed.sh && sleep 7 && \
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml up --build -d db subscription && sleep 7 && \
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml up --build -d frontend backend weather email test-e2e

echo "==== Waiting for test-e2e container to finish ===="
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml wait test-e2e
TEST_EXIT_CODE=$?

echo "==== Tailing logs for test-e2e ===="
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml logs test-e2e

docker compose down --remove-orphans
docker compose -f ../docker-compose.e2e.yml down --volumes

echo "exit code" $TEST_EXIT_CODE
exit $TEST_EXIT_CODE