./create-db-if-needed.sh && \
docker compose up --build -d rabbitmq &&
docker compose up --build frontend backend subscription db weather email notification redis