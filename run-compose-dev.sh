export SECRET_KEY=abc123
export DEBUG=True
export POSTGRES_DB=jwt_auth_db

export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export DOMAIN='localhost'
export AWS_SES_REGION_NAME=$1
export AWS_ACCESS_KEY_ID=$2
export AWS_SECRET_ACCESS_KEY=$3
export POSTGRES_HOST=$4


COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose -f docker-compose.dev.yml up -d --build

# make sure the postgres container is ready, then run migrations
sleep 10
docker exec jwt-auth-template-api-1 python /src/manage.py makemigrations 
docker exec jwt-auth-template-api-1  python /src/manage.py migrate
