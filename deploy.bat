set IMAGE_NAME=jnsia/demo-frontend:latest
set CONTAINER_NAME=demo-frontend

docker build -t %IMAGE_NAME% .

docker stop %CONTAINER_NAME% || echo "Container %CONTAINER_NAME% not running."
docker rm %CONTAINER_NAME% || echo "Container %CONTAINER_NAME% not found."

docker run -d --name %CONTAINER_NAME% -p 5460:5173 %IMAGE_NAME%