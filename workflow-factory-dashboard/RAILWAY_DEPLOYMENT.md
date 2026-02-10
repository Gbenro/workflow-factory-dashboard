# Railway Deployment Guide

Complete guide to deploying the Workflow Factory Dashboard to [Railway](https://railway.app).

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Deployment Methods](#deployment-methods)
6. [Database Management](#database-management)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Troubleshooting](#troubleshooting)
9. [Scaling](#scaling)
10. [Security Best Practices](#security-best-practices)

## Quick Start

Deploy in 5 minutes:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init --name workflow-factory-dashboard

# 4. Deploy
./scripts/deploy-to-railway.sh --project-id YOUR_PROJECT_ID
```

## Prerequisites

### Required Tools

- **Railway CLI**: `npm install -g @railway/cli`
- **Git**: Version control
- **Docker**: For local building (optional, Railway builds for you)
- **Node.js 18+**: For frontend build
- **Python 3.11+**: For backend
- **curl**: Health checks

### Railway Account

1. Create free account at [railway.app](https://railway.app)
2. Note your project ID
3. Generate Railway API token (Settings → Tokens)

### Environment Variables

Set these in Railway dashboard before deployment:

```env
RAILWAY_TOKEN=your_token_here
RAILWAY_PROJECT_ID=your_project_id
RAILWAY_DOMAIN=your-domain.railway.app
RAILWAY_BACKEND_URL=https://your-domain-backend.railway.app
RAILWAY_FRONTEND_URL=https://your-domain-frontend.railway.app
```

## Setup Instructions

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

Verify installation:
```bash
railway --version
```

### Step 2: Authenticate

```bash
railway login
```

This opens a browser to authenticate with Railway.

### Step 3: Create Railway Project

```bash
cd /path/to/workflow-factory-dashboard
railway init
```

Follow the prompts to:
- Create a new project
- Name it (e.g., "workflow-factory-dashboard")
- Select regional preference

### Step 4: Configure Services

Railway will automatically detect services from `railway.json`. Configure:

#### Frontend Service
```bash
railway service frontend
```

Set environment variables:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WS_URL`: WebSocket URL
- `NODE_ENV`: production

#### Backend Service
```bash
railway service backend
```

Set environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Production secret (generate: `openssl rand -hex 32`)
- `CORS_ORIGINS`: Frontend URL
- `ENV`: production

#### Database Service (PostgreSQL)
```bash
railway service postgres
```

Railway automatically manages:
- `POSTGRES_USER`: workflow_user
- `POSTGRES_PASSWORD`: Auto-generated (copy to SECRET)
- `POSTGRES_DB`: workflow_factory

### Step 5: Deploy

```bash
./scripts/deploy-to-railway.sh --project-id YOUR_PROJECT_ID
```

Or use GitHub Actions (automatic on push to main):
```bash
git push origin main
```

### Step 6: Verify Deployment

Check status:
```bash
railway status --projectId YOUR_PROJECT_ID
```

View logs:
```bash
railway logs --projectId YOUR_PROJECT_ID --service backend
railway logs --projectId YOUR_PROJECT_ID --service frontend
```

Access your app:
- Frontend: `https://your-project-frontend.railway.app`
- Backend: `https://your-project-backend.railway.app/api/health`

## Environment Variables

### Backend (.env for production)

```env
# Database
DATABASE_URL=postgresql://workflow_user:password@postgres:5432/workflow_factory

# Application
ENV=production
PYTHONUNBUFFERED=1
SECRET_KEY=your-very-secret-key-change-this

# Security
CORS_ORIGINS=https://your-frontend-domain.railway.app
SECURE_PROXY_HEADER=X-Forwarded-For

# Optional: Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info
```

### Frontend (.env for production)

```env
# API Endpoints
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend-domain.railway.app

# Build
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Environment Variable Configuration Steps

1. **Via Dashboard**:
   - Go to Railway dashboard
   - Select project → service
   - Click "Variables"
   - Add each variable
   - Click "Deploy"

2. **Via CLI**:
```bash
railway variable set SECRET_KEY=your-secret-key
railway variable set DATABASE_URL=postgresql://...
```

3. **Via `.env.railway`**:
   - Create `.env.railway` in project root
   - Copy template from `.env.railway`
   - Railway CLI reads this file

## Deployment Methods

### Method 1: GitHub Actions (Recommended)

Automatic deployment on push to main:

```bash
# Set GitHub Actions secrets
gh secret set RAILWAY_TOKEN -b "your-railway-token"
gh secret set RAILWAY_PROJECT_ID -b "your-project-id"
gh secret set RAILWAY_DOMAIN -b "your-domain.railway.app"
gh secret set RAILWAY_BACKEND_URL -b "https://backend.railway.app"
gh secret set RAILWAY_FRONTEND_URL -b "https://frontend.railway.app"

# Trigger deployment
git push origin main
```

### Method 2: CLI Deployment Script

Manual deployment using provided script:

```bash
# With all options
./scripts/deploy-to-railway.sh \
  --project-id YOUR_PROJECT_ID \
  --environment production \
  --no-migrations false

# Validate only (no deploy)
./scripts/deploy-to-railway.sh \
  --project-id YOUR_PROJECT_ID \
  --validate-only

# Skip database migrations
./scripts/deploy-to-railway.sh \
  --project-id YOUR_PROJECT_ID \
  --no-migrations
```

### Method 3: Manual Railway CLI

Direct Railway commands:

```bash
# Push code
railway up --projectId YOUR_PROJECT_ID

# Run migrations
railway run alembic upgrade head

# Check status
railway status

# View logs
railway logs -f

# Rollback
railway rollback --projectId YOUR_PROJECT_ID
```

## Database Management

### Initial Setup

Database migrations run automatically on deployment:

```bash
# Manually run migrations
railway run alembic upgrade head

# Check migration status
railway run alembic current

# View migrations
railway run alembic history
```

### Backup

Railway PostgreSQL provides automatic daily backups.

Manual backup:
```bash
# Connect to database
railway connect --service postgres

# In psql shell
\dt  # List tables
```

### Restore

From Railway dashboard:
1. Go to PostgreSQL service
2. Click "Backups"
3. Select backup → "Restore"

## Monitoring and Logging

### View Logs

```bash
# Real-time logs
railway logs -f

# Specific service
railway logs -f --service backend

# Last 100 lines
railway logs --limit 100

# Specific time range
railway logs --since "10 minutes ago"
```

### Health Checks

Services have automatic health checks:

**Backend**: `GET /api/health`
```bash
curl https://your-backend.railway.app/api/health
```

**Frontend**: `GET /`
```bash
curl https://your-frontend.railway.app
```

**Database**: Automatic pg_isready checks

### Monitoring Dashboard

1. Login to Railway dashboard
2. Select project
3. Monitor metrics:
   - CPU usage
   - Memory usage
   - Network I/O
   - Deployment history

### Third-Party Monitoring (Optional)

#### Sentry (Error Tracking)

```bash
# Set Sentry DSN
railway variable set SENTRY_DSN="https://key@sentry.io/project"
```

#### Datadog (Performance)

```bash
# Set Datadog API key
railway variable set DD_API_KEY="your-datadog-api-key"
railway variable set DD_SITE="datadoghq.com"
```

#### New Relic

```bash
# Set New Relic license
railway variable set NEW_RELIC_LICENSE_KEY="your-key"
```

## Troubleshooting

### Deployment Fails

1. Check logs:
```bash
railway logs -f
```

2. Verify environment variables:
```bash
railway variable list
```

3. Check Docker build:
```bash
railway build --projectId YOUR_PROJECT_ID
```

4. Rebuild and redeploy:
```bash
railway up --projectId YOUR_PROJECT_ID --force
```

### Database Connection Errors

```bash
# Verify DATABASE_URL
railway variable list | grep DATABASE_URL

# Test connection
railway run psql $DATABASE_URL

# Check PostgreSQL service status
railway status --service postgres
```

### Frontend Not Loading

1. Check frontend logs:
```bash
railway logs -f --service frontend
```

2. Verify API URL:
```bash
railway variable list | grep NEXT_PUBLIC_API_URL
```

3. Check health:
```bash
curl -v https://your-frontend.railway.app
```

### Backend API Errors

1. Check backend logs:
```bash
railway logs -f --service backend
```

2. Verify database is ready:
```bash
railway run alembic current
```

3. Test API endpoint:
```bash
curl -v https://your-backend.railway.app/api/health
```

### Common Issues

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Service not healthy, check logs and restart |
| Database locked | Run migrations completed, check migrations status |
| CORS errors | Verify CORS_ORIGINS environment variable |
| Out of memory | Increase service memory allocation (see Scaling) |
| Slow response | Check service metrics, consider horizontal scaling |

## Scaling

### Vertical Scaling (More Powerful Instances)

1. Go to Railway dashboard → Service
2. Click "Settings"
3. Select Plan:
   - Standard: 512MB RAM, shared CPU
   - Pro: 1GB RAM, dedicated CPU
   - Enterprise: Custom resources

### Horizontal Scaling (Multiple Instances)

```bash
# Scale backend to 2 instances
railway variable set RAILWAY_REPLICAS=2 --service backend

# Scale frontend to 3 instances
railway variable set RAILWAY_REPLICAS=3 --service frontend
```

Or via dashboard:
1. Service → Settings
2. Adjust "Replicas" slider
3. Apply

### Load Balancing

Railway automatically load balances across replicas. Requests distribute evenly.

### Database Scaling

For larger deployments:

1. Upgrade PostgreSQL plan
2. Consider read replicas for queries

Contact Railway support for:
- Database scaling
- Custom resource allocation
- Performance optimization

## Security Best Practices

### Environment Variables

✓ **DO**:
- Store secrets in Railway Variables (not in code)
- Use strong SECRET_KEY (32+ characters)
- Rotate secrets regularly
- Use environment-specific values

✗ **DON'T**:
- Commit `.env` files
- Use weak passwords
- Share credentials
- Log sensitive data

### CORS Configuration

Set appropriate CORS origins:

```bash
# Single origin
railway variable set CORS_ORIGINS="https://your-domain.railway.app"

# Multiple origins (comma-separated)
railway variable set CORS_ORIGINS="https://your-domain.railway.app,https://www.your-domain.com"
```

### SSL/TLS

Railway provides automatic SSL certificates:
- All requests are HTTPS
- Automatic renewal
- No additional configuration

### Database Security

1. Use strong PostgreSQL passwords:
```bash
# Generate secure password
openssl rand -base64 32
```

2. Restrict network access (Railway does this by default)

3. Regular backups enabled automatically

### API Security

- Use environment variables for API keys
- Implement rate limiting
- Add CORS headers
- Validate all inputs
- Use secure cookies (HttpOnly, SameSite)

### Monitoring for Security

- Review logs regularly
- Set up error alerts
- Monitor failed auth attempts
- Check for unusual traffic patterns

## Advanced Configuration

### Custom Domain

1. In Railway dashboard → project settings
2. Add custom domain
3. Update DNS records (CNAME)
4. Wait for propagation (15-60 minutes)

### Custom Start Commands

Override in `railway.json`:

```json
{
  "backend": {
    "deploy": {
      "startCommand": "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    }
  }
}
```

### Build Configuration

Multi-stage Dockerfiles optimize:
- Build time
- Image size
- Cold start performance

Current setup uses multi-stage builds for both services.

### Environment-Specific Deployments

Create separate projects:
- `workflow-factory-staging`
- `workflow-factory-production`

Or use branches:
- Push to `staging` → deploys to staging
- Push to `main` → deploys to production

## Getting Help

- **Railway Docs**: https://docs.railway.app
- **Community**: https://community.railway.app
- **Status**: https://status.railway.app
- **Email Support**: support@railway.app

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Database backups enabled
- [ ] Health checks passing
- [ ] Frontend CORS configured
- [ ] API endpoints tested
- [ ] SSL certificate installed
- [ ] Secrets rotated
- [ ] Error tracking (Sentry) configured
- [ ] Logs monitoring set up
- [ ] Team access configured in Railway

## Next Steps

1. Deploy using `./scripts/deploy-to-railway.sh`
2. Monitor logs and health
3. Set up error tracking and monitoring
4. Configure custom domain
5. Implement backup strategy
6. Set up team access in Railway
7. Document deployment procedures

---

**Last Updated**: 2026-02-09
**Railway Documentation**: https://docs.railway.app
**Version**: 1.0
