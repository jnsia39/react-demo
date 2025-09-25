set IMAGE_NAME=jnsia/demo-frontend:latest
set CONTAINER_NAME=demo-frontend

docker build -t %IMAGE_NAME% .

docker stop %CONTAINER_NAME% 2>nul || echo >nul
docker rm %CONTAINER_NAME% 2>nul || echo >nul

docker run -d --name %CONTAINER_NAME% -p 5460:80 %IMAGE_NAME%