# Docker Commands Reference

## Build Commands

### Build image
```bash
docker build -t nodejs-app:latest .
```

### Build with specific tag
```bash
docker build -t ghcr.io/yourusername/nodejs-app:v1.0.0 .
```

### Build and load to local Docker
```bash
docker buildx build --load -t nodejs-app:latest .
```

## Run Commands

### Run develop environment
```bash
docker run -p 5000:5000 \
  -e NODE_ENV=development \
  -e JWT_SECRET=dev_secret \
  -e CORS_ORIGIN=http://localhost:3000 \
  nodejs-app:latest
```

### Run with .env file
```bash
docker run -p 5000:5000 \
  --env-file .env \
  nodejs-app:latest
```

### Run in background (detached)
```bash
docker run -d -p 5000:5000 \
  --name my-app \
  --env-file .env \
  nodejs-app:latest
```

### Run with volume mount (for development)
```bash
docker run -p 5000:5000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --env-file .env \
  nodejs-app:latest
```

## Docker Compose Commands

### Start all services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Start only develop
```bash
docker-compose up app-develop
```

### Start UAT service
```bash
docker-compose --profile uat up app-uat
```

### Start production service
```bash
docker-compose --profile prod up app-prod
```

### Start specific service and rebuild
```bash
docker-compose up --build app-develop
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f app-develop
```

### View logs for specific service
```bash
docker-compose logs -f app-develop --tail=50
```

### Execute command in running container
```bash
docker-compose exec app-develop npm test
```

## Container Commands

### List all containers
```bash
docker ps -a
```

### List running containers
```bash
docker ps
```

### View container logs
```bash
docker logs container_id
```

### Follow logs in real-time
```bash
docker logs -f container_id
```

### Stop container
```bash
docker stop container_id
```

### Start container
```bash
docker start container_id
```

### Remove container
```bash
docker rm container_id
```

### Restart container
```bash
docker restart container_id
```

### Execute command in running container
```bash
docker exec -it container_id npm test
```

### Access shell of running container
```bash
docker exec -it container_id /bin/sh
```

## Image Commands

### List all images
```bash
docker images
```

### Remove image
```bash
docker rmi image_id
```

### Tag image
```bash
docker tag nodejs-app:latest ghcr.io/yourusername/nodejs-app:latest
```

### View image history
```bash
docker history nodejs-app:latest
```

### Inspect image
```bash
docker inspect nodejs-app:latest
```

## Registry Commands

### Login to GitHub Container Registry
```bash
docker login ghcr.io -u yourusername -p your_token
```

### Push image to registry
```bash
docker push ghcr.io/yourusername/nodejs-app:latest
```

### Pull image from registry
```bash
docker pull ghcr.io/yourusername/nodejs-app:latest
```

## Network Commands

### List networks
```bash
docker network ls
```

### Inspect network
```bash
docker network inspect app-network
```

## Cleanup Commands

### Remove unused images
```bash
docker image prune
```

### Remove all unused images
```bash
docker image prune -a
```

### Remove unused volumes
```bash
docker volume prune
```

### Remove unused networks
```bash
docker network prune
```

### Full cleanup (containers, images, volumes, networks)
```bash
docker system prune -a --volumes
```

## Useful One-Liners

### Stop and remove all containers
```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

### Remove all images
```bash
docker rmi $(docker images -q)
```

### Check if app is healthy
```bash
docker exec container_id curl http://localhost:5000/health
```

### View resource usage
```bash
docker stats
```

## Debugging

### Check app status
```bash
docker ps | grep nodejs-app
```

### View full container info
```bash
docker inspect container_id
```

### Check network connectivity
```bash
docker exec container_id ping google.com
```

### Check port binding
```bash
docker port container_id
```

### View running processes in container
```bash
docker top container_id
```
