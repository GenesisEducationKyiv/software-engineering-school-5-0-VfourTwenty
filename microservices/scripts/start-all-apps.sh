./create-db-if-needed.sh && \
docker compose up --build -d redis rabbitmq && sleep 4 && \
docker compose up --build frontend backend subscription db weather email notification prometheus