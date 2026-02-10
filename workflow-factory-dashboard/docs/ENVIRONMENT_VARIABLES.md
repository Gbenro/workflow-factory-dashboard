# Environment Variables Reference

Complete reference for all environment variables used in the Workflow Factory Dashboard.

## Overview

Environment variables are categorized by service:
- **Backend** (FastAPI/Python)
- **Frontend** (Next.js)
- **Database** (PostgreSQL)
- **Infrastructure** (Railway)

## Backend Variables

### Database Connection

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✓ | - | PostgreSQL connection string: `postgresql://user:password@host:port/database` |

**Example**:
```
postgresql://workflow_user:mypassword@postgres:5432/workflow_factory
```

### Application Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENV` | ✓ | `development` | Environment: `development`, `staging`, `production` |
| `SECRET_KEY` | ✓ | - | Secret key for cryptographic operations (min 32 chars) |
| `PYTHONUNBUFFERED` | - | `1` | Force Python to write output immediately (useful in containers) |
| `PORT` | - | `8000` | Port to run the application on |
| `LOG_LEVEL` | - | `info` | Logging level: `debug`, `info`, `warning`, `error`, `critical` |

**Secret Key Generation**:
```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Or using OpenSSL
openssl rand -hex 32
```

### CORS Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CORS_ORIGINS` | - | `*` | Comma-separated list of allowed origins (empty for all) |

**Examples**:
```
# Single origin
https://your-domain.railway.app

# Multiple origins
https://your-domain.railway.app,https://www.your-domain.com,http://localhost:3000
```

### Security

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SECURE_PROXY_HEADER` | - | - | Header to trust for secure connections (e.g., `X-Forwarded-For`) |
| `TRUSTED_PROXIES` | - | `*` | IP addresses to trust as proxies (comma-separated) |

### Optional: Error Tracking

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | - | - | Sentry error tracking DSN |
| `SENTRY_ENV` | - | `ENV` value | Sentry environment name |
| `SENTRY_TRACES_SAMPLE_RATE` | - | `0.1` | Performance monitoring sample rate (0-1) |

**Sentry Setup**:
```bash
railway variable set SENTRY_DSN="https://key@sentry.io/12345"
railway variable set SENTRY_ENV="production"
```

### Optional: API Keys and Third-Party Services

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_KEY_EXTERNAL_SERVICE` | - | - | API key for external integrations |
| `REDIS_URL` | - | - | Redis connection URL for caching |
| `SMTP_HOST` | - | - | SMTP server for email notifications |
| `SMTP_PORT` | - | `587` | SMTP port |
| `SMTP_USER` | - | - | SMTP username |
| `SMTP_PASSWORD` | - | - | SMTP password |

## Frontend Variables

### API Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✓ | `http://localhost:8000` | Backend API base URL (must be public) |
| `NEXT_PUBLIC_WS_URL` | - | - | WebSocket URL for real-time features |

**Examples**:
```
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
```

### Build & Runtime

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✓ | `development` | Environment: `development`, `production` |
| `PORT` | - | `3000` | Port to run Next.js on |
| `NEXT_PUBLIC_SITE_URL` | - | - | Public site URL for meta tags and redirects |

### Optional: Analytics

| Variable | Required | Default | Description |
|----------|----------|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | - | - | Google Analytics ID |
| `NEXT_PUBLIC_HOTJAR_ID` | - | - | Hotjar analytics ID |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | - | - | Mixpanel analytics token |

**Google Analytics Example**:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Optional: Error Tracking

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | - | - | Sentry DSN (public, safe to expose) |

## Database Variables

### PostgreSQL Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTGRES_USER` | ✓ | `workflow_user` | Database user |
| `POSTGRES_PASSWORD` | ✓ | - | Database password |
| `POSTGRES_DB` | ✓ | `workflow_factory` | Database name |
| `POSTGRES_HOST` | ✓ | `postgres` | Database host |
| `POSTGRES_PORT` | - | `5432` | Database port |

### Backup & Maintenance

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTGRES_BACKUP_RETENTION_DAYS` | - | `7` | Days to retain backups |
| `POSTGRES_MAX_CONNECTIONS` | - | `100` | Maximum concurrent connections |
| `POSTGRES_SHARED_BUFFERS` | - | `256MB` | Shared memory for caching |

## Railway Infrastructure Variables

### Deployment

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAILWAY_ENVIRONMENT` | - | - | Environment name (auto-set by Railway) |
| `RAILWAY_SERVICE` | - | - | Current service name (auto-set by Railway) |
| `RAILWAY_CONTEXT` | - | - | Deployment context |
| `RAILWAY_TOKEN` | ✓ (CLI) | - | Railway API token for CLI deployments |

### Scaling

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAILWAY_REPLICAS` | - | `1` | Number of service instances |
| `RAILWAY_MEMORY` | - | `512MB` | Memory allocation per instance |
| `RAILWAY_CPU` | - | Shared | CPU allocation (Shared, Dedicated, Premium) |

### Networking

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAILWAY_DOMAIN` | - | auto-generated | Custom domain for project |

## Setting Environment Variables

### Method 1: Railway Dashboard

1. Login to [railway.app](https://railway.app)
2. Select project → Service
3. Click "Variables"
4. Add variables in key-value format
5. Click "Deploy" to apply

### Method 2: Railway CLI

```bash
# Set single variable
railway variable set SECRET_KEY="your-secret-key"

# Set from file
railway variable set -f .env.production

# List variables
railway variable list

# Delete variable
railway variable unset SECRET_KEY
```

### Method 3: GitHub Secrets (for Actions)

```bash
# Set GitHub secret
gh secret set RAILWAY_TOKEN -b "your-railway-token"

# GitHub Actions will use as ${{ secrets.RAILWAY_TOKEN }}
```

### Method 4: Local .env File

For local development:

```bash
# .env.local (git-ignored)
DATABASE_URL=postgresql://workflow_user:password@localhost:5432/workflow_factory
SECRET_KEY=local-dev-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

**Workflow**:
```bash
# Copy template
cp .env.railway .env.local

# Edit values
nano .env.local

# Load in shell
export $(cat .env.local | xargs)

# Run application
python -m uvicorn app.main:app  # Backend
npm run dev  # Frontend
```

## Environment-Specific Values

### Development

```
ENV=development
SECRET_KEY=dev-key-can-be-simple
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://workflow_user:password@localhost:5432/workflow_factory
```

### Staging

```
ENV=staging
SECRET_KEY=<strong-secret-key>
NEXT_PUBLIC_API_URL=https://staging-api.railway.app
NODE_ENV=production
CORS_ORIGINS=https://staging-dashboard.railway.app
LOG_LEVEL=info
DATABASE_URL=postgresql://workflow_user:<strong-password>@postgres:5432/workflow_factory
SENTRY_ENV=staging
```

### Production

```
ENV=production
SECRET_KEY=<very-strong-secret-key-32-chars>
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NODE_ENV=production
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
LOG_LEVEL=warning
DATABASE_URL=postgresql://workflow_user:<strong-password>@postgres:5432/workflow_factory
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_ENV=production
```

## Validation & Testing

### Verify Variables Are Set

```bash
# List all variables
railway variable list

# Check specific variable
railway variable get SECRET_KEY

# Verify connection string
railway run psql -c "SELECT 1" $DATABASE_URL
```

### Test Database Connection

```bash
# From within Railway service
railway run python -c "from sqlalchemy import create_engine; engine = create_engine('$DATABASE_URL'); connection = engine.connect(); print('Connected!'); connection.close()"
```

### Test API

```bash
# Health check
curl https://your-api.railway.app/api/health

# Check environment variable is loaded
railway logs --since "1 minute ago" | grep "SECRET_KEY"
```

## Security Best Practices

### ✓ DO

- Store sensitive values in Railway Variables (not code)
- Rotate `SECRET_KEY` regularly
- Use strong, random passwords (32+ characters)
- Commit `.env.example` with dummy values only
- Review variable access permissions
- Enable audit logging for secret access

### ✗ DON'T

- Commit `.env` files with real values
- Share secrets via email/chat
- Use simple passwords
- Log sensitive values
- Hardcode secrets in application code
- Commit Railway tokens

## Troubleshooting

### Variable Not Loading

```bash
# Force redeploy
railway up --projectId YOUR_PROJECT_ID --force

# Check logs
railway logs -f | grep "variable"
```

### Database Connection Failed

```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection manually
railway run psql $DATABASE_URL
```

### API Returns 500 Errors

```bash
# Check logs for missing variables
railway logs -f

# Verify all required variables are set
railway variable list | grep -E "SECRET_KEY|DATABASE_URL"
```

## Reference

- **Railway Docs**: https://docs.railway.app/reference/project-members
- **Next.js Env**: https://nextjs.org/docs/basic-features/environment-variables
- **FastAPI Env**: https://fastapi.tiangolo.com/advanced/settings/
- **Sentry Setup**: https://docs.sentry.io/platforms/python/

---

**Last Updated**: 2026-02-09
**Version**: 1.0
