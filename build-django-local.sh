DOCKERHUB_UNAME=successphil

BASE_URL=$1
NEW_VERSION=$2

docker build -t $DOCKERHUB_UNAME/jwt-auth-template_api-local:$NEW_VERSION -f backend/Dockerfile ./backend --no-cache
docker push $DOCKERHUB_UNAME/jwt-auth-template_api-local:$NEW_VERSION