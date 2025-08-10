service - port - host port for docker

backend      - 4000 - 5000
frontend     - 4001 - 5001
weather      - 4002 - 5002
subscription - 4003 - 5003
email        - 4004 - 5004

postgres     - 5432 - 5005
redis        - 6379 - 5006
prometheus   - 9090 - 5007

rabbitMQ     - 5672 - 5008
notification - 4009 - 5009



Most teams and the Docker Compose docs use this order for clarity:
container_name
build or image
networks
depends_on
ports
volumes
environment
command
restart
(other options...)#