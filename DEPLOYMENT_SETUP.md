# Multi-Environment CI/CD Deployment Setup

## Overview
This project uses Docker and GitHub Actions for automated CI/CD across 3 environments:
- **develop**: Development environment (auto-deploy on `develop` branch)
- **uat**: User Acceptance Testing (auto-deploy on `uat` branch)
- **production**: Production environment (auto-deploy on `main` branch)

## Architecture

```
Push to GitHub
    ↓
GitHub Actions
    ├─ Test (npm test, npm run lint)
    ├─ Build Docker Image
    ├─ Push to GitHub Container Registry (ghcr.io)
    └─ Deploy to appropriate environment based on branch
         ├─ develop branch → Deploy to Develop
         ├─ uat branch → Deploy to UAT
         └─ main branch → Deploy to Production
```

## Local Development

### 1. Run all environments locally
```bash
docker-compose up
```

This starts:
- **Develop**: `http://localhost:5000` (auto-reload with `npm run dev`)
- **UAT**: `http://localhost:5001` (profile: uat)
- **Prod**: `http://localhost:5002` (profile: prod)

### 2. Run only develop
```bash
docker-compose up app-develop
```

### 3. Run only UAT
```bash
docker-compose -f docker-compose.yml --profile uat up app-uat
```

### 4. Run only Production
```bash
docker-compose -f docker-compose.yml --profile prod up app-prod
```

### 5. Build Docker image manually
```bash
docker build -t nodejs-app:latest .
```

### 6. Run container manually
```bash
docker run -p 5000:5000 -e NODE_ENV=development -e CORS_ORIGIN=http://localhost:3000 nodejs-app:latest
```

## GitHub Actions Setup

### 1. Create GitHub Secrets

Go to: GitHub Repository → Settings → Secrets and variables → Actions

**For Develop Environment:**
- `RENDER_API_KEY_DEVELOP` - Your Render API key
- `RENDER_SERVICE_ID_DEVELOP` - Render service ID for develop

**For UAT Environment:**
- `RENDER_API_KEY_UAT` - Your Render API key
- `RENDER_SERVICE_ID_UAT` - Render service ID for UAT

**For Production Environment:**
- `RENDER_API_KEY` - Your Render API key
- `RENDER_SERVICE_ID` - Render service ID for production

### 2. Create Git Branches

```bash
# Create and push develop branch
git checkout -b develop
git push -u origin develop

# Create and push uat branch
git checkout -b uat
git push -u origin uat

# Main branch already exists (use main or master)
```

## How It Works

### Workflow Steps

1. **Developer pushes code to branch**
   ```bash
   git push origin develop  # or uat, or main
   ```

2. **GitHub Actions triggers automatically**
   - Runs tests and linting
   - If tests pass, builds Docker image
   - Pushes image to GitHub Container Registry

3. **Deploy based on branch**
   - `develop` → Deploy to Develop Render service
   - `uat` → Deploy to UAT Render service
   - `main` → Deploy to Production Render service

4. **Render deploys new container**
   - Pulls latest Docker image
   - Stops old container
   - Starts new container
   - Logs visible in Render dashboard

### Image Tags in Registry

Images are automatically tagged:
- `develop-latest` - Latest from develop branch
- `uat-latest` - Latest from uat branch
- `main-latest` - Latest from main branch
- `develop-abc123def` - Specific commit hash
- `v1.0.0` - Semantic versioning (if using git tags)

View all images: GitHub → Packages → Select repository

## Environment Configuration

### .env Files (per environment)

**Develop (.env.develop)**
```
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**UAT (.env.uat)**
```
NODE_ENV=uat
PORT=5000
JWT_SECRET=uat_secret_key_change_in_production
CORS_ORIGIN=https://uat-react-app.vercel.app
```

**Production (.env.prod)**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=prod_secret_key_change_in_production
CORS_ORIGIN=https://react-app.vercel.app
```

### Set Render Environment Variables

For each Render service (develop, uat, production):
1. Go to service settings
2. Add environment variables from .env file
3. Click "Deploy" to restart with new config

## Monitoring & Logs

### View Logs in Render
1. Go to Render dashboard
2. Select service (develop, uat, or production)
3. Click "Logs" tab
4. See real-time logs as app runs

### GitHub Actions Logs
1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow run
4. View build, test, push, deploy logs

## Troubleshooting

### Build fails in GitHub Actions
- Check test output: `Actions` tab → Select workflow → View logs
- Fix failing tests locally first
- Push again

### Image not updating on Render
- Verify Render service has webhook enabled
- Check Docker image was pushed to registry: GitHub → Packages
- Manually trigger deploy in Render if needed

### CORS errors
- Update `CORS_ORIGIN` in environment variables
- Make sure React app URL is in the allowed list

### Container won't start
- Check logs: Render dashboard → Logs
- Verify environment variables are set
- Check port is not already in use: `docker ps`

## Best Practices

1. **Branch protection**
   - Require PR reviews before merging to main
   - Require tests to pass before merge

2. **Testing**
   - Always write tests before pushing
   - Run `npm test` locally
   - Check test coverage

3. **Commits**
   - Use meaningful commit messages
   - Use semantic versioning for releases

4. **Environment secrets**
   - Never commit .env files
   - Use GitHub Secrets for sensitive data
   - Rotate secrets regularly

5. **Monitoring**
   - Check Render logs after each deploy
   - Set up alerts for errors

## Common Commands

```bash
# Local development
docker-compose up app-develop

# Build image
docker build -t nodejs-app:latest .

# Push manually (if needed)
docker push ghcr.io/username/repository:latest

# Stop all containers
docker-compose down

# View running containers
docker ps

# View image history
docker history nodejs-app:latest

# Clean up unused images
docker image prune -a
```

## CI/CD Pipeline Visualization

```
main branch push
    ↓
GitHub Actions
    ├─ Checkout
    ├─ Setup Node.js
    ├─ Test & Lint (npm test, npm run lint)
    ├─ Build Docker Image (docker/build-push-action)
    ├─ Push to ghcr.io
    └─ Deploy to Production via Render API
         ↓
    Production Render Service (pulls image, restarts container)
         ↓
    App running at production URL with logs visible
```

## Next Steps

1. Create 3 Render services (develop, uat, production) if not already done
2. Get API keys and service IDs from Render
3. Add GitHub secrets
4. Create git branches (develop, uat)
5. Push code and watch CI/CD pipeline run
6. Monitor first deployment in Render dashboard
