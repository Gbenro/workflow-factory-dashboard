# Deployment Guide

Instructions for deploying Workflow Factory Dashboard to production.

## Prerequisites

- Docker & Docker Compose (recommended)
- GitHub Actions (for CI/CD)
- Hosting platform (Vercel, Railway, AWS, etc.)
- PostgreSQL database
- Domain name (optional)

## Local Deployment (Docker Compose)

The easiest way to test production setup locally:

```bash
# Clone repository
git clone https://github.com/Gbenro/workflow-factory-dashboard
cd workflow-factory-dashboard

# Copy environment files
cp frontend/.env.example frontend/.env.production
cp backend/.env.example backend/.env

# Edit environment files with production values
nano frontend/.env.production
nano backend/.env

# Start with Docker Compose
docker-compose up -d

# Check services are healthy
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Adminer (DB): http://localhost:8080

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_WS_URL

# Redeploy with env vars
vercel --prod
```

**Benefits:**
- Auto-deploys on git push
- Built-in CI/CD
- Serverless functions
- Edge caching
- Easy rollbacks

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Option 3: GitHub Pages

```bash
# Add to package.json
"export": "next export"

# Build static site
npm run build && npm run export

# Files in 'out/' can be deployed to GitHub Pages
```

### Option 4: Docker

```bash
# Build production image
docker build -f Dockerfile.prod -t wfd-frontend:latest .

# Run container
docker run -p 3000:3000 wfd-frontend:latest
```

**Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## Backend Deployment

### Option 1: Railway

```bash
# Connect GitHub account
# https://railway.app

# Select repository
# Set environment variables:
# - DATABASE_URL
# - SECRET_KEY
# - CORS_ORIGINS

# Deploy automatically
```

### Option 2: Render

```bash
# Go to https://render.com
# Connect GitHub
# Create New Web Service
# Point to backend/ directory
# Set environment variables
# Deploy
```

### Option 3: AWS (EC2 + RDS)

```bash
# Create EC2 instance
# Create RDS PostgreSQL database

# SSH into EC2
ssh -i key.pem ubuntu@your-instance-ip

# Install dependencies
sudo apt update
sudo apt install -y python3.11 python3-pip

# Clone repo
git clone https://github.com/Gbenro/workflow-factory-dashboard
cd workflow-factory-dashboard/backend

# Create venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment
export DATABASE_URL="postgresql://..."
export SECRET_KEY="..."

# Run with supervisor or systemd
# Create /etc/systemd/system/wfd-api.service
```

**Systemd service file:**
```ini
[Unit]
Description=Workflow Factory API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/workflow-factory-dashboard/backend
ExecStart=/home/ubuntu/workflow-factory-dashboard/backend/venv/bin/uvicorn \
  app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable wfd-api
sudo systemctl start wfd-api
```

### Option 4: Docker Container (Any Host)

```bash
# Build image
docker build -t wfd-backend:latest .

# Run with environment
docker run -d \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="..." \
  -e CORS_ORIGINS="https://yourdomain.com" \
  -p 8000:8000 \
  wfd-backend:latest

# Or use docker-compose for production
docker-compose -f docker-compose.prod.yml up -d
```

## Database Setup

### Supabase (Recommended for Managed Database)

```bash
# Create Supabase project
# https://app.supabase.com

# Copy database URL
export DATABASE_URL="postgresql://..."

# Run migrations
alembic upgrade head

# Seed data (optional)
python seed_db.py
```

### Self-hosted PostgreSQL

```bash
# Create database
createdb -U postgres workflow_factory

# Connect and create user
psql -U postgres -d workflow_factory

# In PostgreSQL:
CREATE USER workflow_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE workflow_factory TO workflow_user;
```

## Environment Variables

### Production Checklist

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

**Backend (.env):**
```env
ENV=production
DEBUG=false

DATABASE_URL=postgresql://user:pass@host:5432/workflow_factory

SECRET_KEY=<generate-random-key>

CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

API_HOST=0.0.0.0
API_PORT=8000

LOG_LEVEL=WARNING
```

### Generate Secure Secret Key

```python
import secrets
print(secrets.token_urlsafe(32))
```

## Monitoring & Logging

### Application Monitoring

Set up monitoring with:
- **Sentry** – Error tracking
- **Datadog** – Comprehensive monitoring
- **New Relic** – Performance monitoring

```python
# Example: Sentry integration
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
)
```

### Log Aggregation

- **ELK Stack** – Elasticsearch, Logstash, Kibana
- **Loki** – Lightweight log aggregation
- **CloudWatch** – AWS native logging
- **Stackdriver** – Google Cloud logging

```python
# Send logs to external service
import logging
handler = logging.handlers.SysLogHandler(address='/dev/log')
```

### Health Checks

```bash
# Curl health endpoint
curl https://api.yourdomain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-02-09T19:20:00Z",
  "version": "0.1.0"
}
```

## SSL/TLS Certificates

### Let's Encrypt (Free)

```bash
# Using Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Renew automatically
sudo systemctl enable certbot.timer
```

### Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Scaling

### Horizontal Scaling (Multiple Instances)

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    image: wfd-backend:latest
    deploy:
      replicas: 3
    environment:
      DATABASE_URL: ...
    ports:
      - "8000-8002:8000"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Database Connection Pooling

Use **PgBouncer** or built-in pooling:

```python
# In app/db/session.py
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,           # Connections in pool
    max_overflow=40,        # Extra connections allowed
    pool_pre_ping=True,     # Verify connections before use
)
```

## Backup & Recovery

### Database Backups

```bash
# Daily backup using pg_dump
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql

# Restore from backup
psql < /backups/db-20260209.sql
```

### Cloud Backups

- **Supabase** – Automatic daily backups
- **AWS RDS** – Automated snapshots
- **Heroku** – Built-in backups
- **Manual S3** – Upload backups to S3

## Rollback Procedure

### Revert Deployment

```bash
# Vercel
vercel rollback

# Railway
# Go to deployments tab, click "Redeploy" on previous version

# Docker
docker run --rm \
  -e DATABASE_URL=... \
  wfd-backend:v1.0.0
```

### Database Migration Rollback

```bash
# See current version
alembic current

# Downgrade one version
alembic downgrade -1

# Or specific version
alembic downgrade 1d3c61210127
```

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] API responds to requests
- [ ] WebSocket connections work
- [ ] Database queries succeed
- [ ] Authentication working (when implemented)
- [ ] All environment variables set
- [ ] SSL certificates valid
- [ ] Monitoring/logging configured
- [ ] Backups enabled
- [ ] Team notified of deployment

## Troubleshooting

### 502 Bad Gateway

Check if backend is running:

```bash
curl http://localhost:8000/api/health
```

### WebSocket Connection Failed

Ensure WebSocket proxy is configured:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

### Database Connection Error

Verify connection string:

```bash
psql $DATABASE_URL -c "SELECT version();"
```

### High CPU/Memory Usage

Check running processes:

```bash
# Docker
docker stats

# Linux
top
htop
```

## Further Reading

- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app)
- [AWS Deployment](https://docs.aws.amazon.com/lightsail/)
- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)

---

**Ready to go live? 🚀**
