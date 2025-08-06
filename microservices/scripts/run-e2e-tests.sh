#!/bin/bash
set -e

./create-db-if-needed.sh && \
./reset-db.sh && \
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml up --build -d frontend backend db subscription weather email test-e2e

echo "==== Docker Networks ===="
docker network ls
# Set the correct network names   (perhaps should create a separate frontend-e2e network)
FRONTEND_BACKEND_NET="microservices_frontend-backend"
SUBSCRIPTION_DB_NET="microservices_subscription-db"

echo "==== Containers on $FRONTEND_BACKEND_NET network ===="
docker network inspect $FRONTEND_BACKEND_NET | grep Name

echo "==== Containers on $SUBSCRIPTION_DB_NET network ===="
docker network inspect $SUBSCRIPTION_DB_NET | grep Name

echo "==== Connecting subscription-db-test to $SUBSCRIPTION_DB_NET ===="
if docker network inspect $SUBSCRIPTION_DB_NET | grep -q test-subscription-db; then
  echo "subscription-db-test is already connected to $SUBSCRIPTION_DB_NET"
else
  docker network connect $SUBSCRIPTION_DB_NET test-subscription-db && echo "Connected test-subscription-db to $SUBSCRIPTION_DB_NET"
fi

E2E_CONTAINER=$(docker ps --filter "name=e2e-tests" --format "{{.Names}}" | head -n 1)
echo "==== Connecting $E2E_CONTAINER to $FRONTEND_BACKEND_NET ===="
if [ -n "$E2E_CONTAINER" ]; then
  if docker network inspect $FRONTEND_BACKEND_NET | grep -q "$E2E_CONTAINER"; then
    echo "$E2E_CONTAINER is already connected to $FRONTEND_BACKEND_NET"
  else
    docker network connect $FRONTEND_BACKEND_NET "$E2E_CONTAINER" && echo "Connected $E2E_CONTAINER to $FRONTEND_BACKEND_NET"
  fi
else
  echo "e2e container not found, skipping network connect"
fi

echo "==== Final network membership for frontend-backend ===="
docker network inspect $FRONTEND_BACKEND_NET | grep Name

echo "==== Final network membership for subscription-db ===="
docker network inspect $SUBSCRIPTION_DB_NET | grep Name

echo "==== Tailing logs for test-e2e ===="
docker compose -f ../docker-compose.yml -f ../docker-compose.e2e.yml logs -f test-e2e