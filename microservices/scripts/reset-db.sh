set -e

DB_SERVICE="db"  # The service name in docker-compose, not the container name
DB_NAME="subscription_db_test"
DB_USER="postgres"

echo "Resetting database $DB_NAME in service $DB_SERVICE..."

docker compose exec $DB_SERVICE psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "Database $DB_NAME has been reset."