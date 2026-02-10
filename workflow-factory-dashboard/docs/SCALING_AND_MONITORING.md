# Scaling and Monitoring Guide

Best practices for scaling the Workflow Factory Dashboard and monitoring production deployments.

## Table of Contents

1. [Scaling Strategy](#scaling-strategy)
2. [Performance Monitoring](#performance-monitoring)
3. [Load Testing](#load-testing)
4. [Optimization](#optimization)
5. [Error Tracking](#error-tracking)
6. [Health Checks](#health-checks)
7. [Alerting](#alerting)

## Scaling Strategy

### Horizontal Scaling (Multiple Instances)

Scale out by running multiple service instances behind a load balancer.

#### Scale Backend

```bash
# Railway CLI
railway variable set RAILWAY_REPLICAS=3 --service backend

# Or via Railway dashboard
# Services → backend → Settings → Replicas: 3
```

When to scale:
- CPU utilization > 70%
- Response time > 1s
- Pending requests in queue
- High traffic periods

#### Scale Frontend

```bash
# Frontend static content scales better with CDN caching
# Still can scale instances for rendering
railway variable set RAILWAY_REPLICAS=2 --service frontend

# Better: Use Railway's edge caching
```

**Railway handles**:
- Load balancing (automatic)
- Session affinity (sticky sessions)
- Health checks (failing instances removed)
- Automatic rebalancing

### Vertical Scaling (More Powerful Instances)

Upgrade to more powerful instance types.

#### Current Plan

```bash
# Check current plan
railway service info --service backend
```

#### Upgrade Plan

1. **Railway Dashboard**:
   - Service → Settings
   - Select Plan dropdown
   - Choose higher tier (Standard → Pro → Enterprise)
   - Apply changes

2. **Via CLI**:
```bash
railway service update --plan pro
```

#### Plan Options

| Plan | RAM | CPU | Cost/month |
|------|-----|-----|-----------|
| Standard | 512MB | Shared | Free |
| Pro | 1GB | Dedicated | $12 |
| Premium | 2GB+ | Premium | Custom |

### Database Scaling

PostgreSQL scaling strategies:

#### Connection Pooling

Limit connections with PgBouncer:

```env
PGBOUNCER_POOL_MODE=transaction
PGBOUNCER_MAX_CLIENT_CONN=200
PGBOUNCER_DEFAULT_POOL_SIZE=25
```

#### Query Optimization

Monitor slow queries:

```bash
# Connect to database
railway connect --service postgres

# In psql
SELECT query, calls, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

#### Indexing

Add indexes for frequently queried columns:

```sql
-- Check for missing indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname != 'pg_catalog';

-- Create index
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

#### Read Replicas

For read-heavy workloads:

1. Create PostgreSQL read replica in Railway
2. Configure backend to read from replica
3. Write operations still go to primary

```python
# Backend FastAPI example
read_db_url = os.getenv("DATABASE_READ_URL")
write_db_url = os.getenv("DATABASE_URL")

# Use read_db_url for SELECT queries
# Use write_db_url for INSERT/UPDATE/DELETE
```

## Performance Monitoring

### Key Metrics

| Metric | Target | Alert At |
|--------|--------|----------|
| CPU Usage | < 50% | > 80% |
| Memory Usage | < 60% | > 85% |
| Response Time (p95) | < 500ms | > 1000ms |
| Error Rate | < 0.1% | > 1% |
| Database Connections | < 50/100 | > 80 |
| Disk I/O | < 50% | > 80% |

### Railway Dashboard Monitoring

1. Login to [railway.app](https://railway.app)
2. Select project → service
3. View metrics:
   - **CPU**: CPU core usage percentage
   - **Memory**: RAM usage in MB/GB
   - **Network**: Bytes sent/received
   - **Deployment**: Success/failure history

### Custom Monitoring with Third-Party Tools

#### Sentry (Error Tracking)

Setup:

```bash
# 1. Create Sentry project at sentry.io

# 2. Set environment variable
railway variable set SENTRY_DSN="https://key@sentry.io/project"

# 3. Backend will auto-send errors
```

Backend integration (already in requirements.txt):

```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENV"),
    traces_sample_rate=0.1
)
```

#### Datadog (Full-Stack Monitoring)

```bash
# Install agent
pip install datadog

# Set variables
railway variable set DD_API_KEY="your-api-key"
railway variable set DD_SITE="datadoghq.com"
railway variable set DD_SERVICE="workflow-factory"
```

#### New Relic (APM)

```bash
# Install agent
pip install newrelic

# Set variables
railway variable set NEW_RELIC_LICENSE_KEY="your-key"
railway variable set NEW_RELIC_APP_NAME="Workflow Factory"
```

### Application Performance Monitoring (APM)

Built-in metrics:

```bash
# Enable detailed logging
railway variable set LOG_LEVEL=debug

# View metrics
railway logs -f | grep -i "duration\|request\|error"
```

## Load Testing

### Local Load Testing

Using Apache Bench or wrk:

```bash
# Install wrk
brew install wrk  # macOS
apt install wrk   # Linux

# Test API endpoint
wrk -t4 -c100 -d30s https://your-api.railway.app/api/health

# Results show:
# - Requests per second
# - Latency distribution
# - Error rate
```

### Load Test Workflow

```bash
# 1. Deploy to staging
git push origin staging

# 2. Wait for deployment
railway status --projectId STAGING_PROJECT

# 3. Run load tests
wrk -t4 -c100 -d60s https://staging-api.railway.app/api/workflows

# 4. Monitor metrics
railway logs -f

# 5. Check response times
# 6. Evaluate need for scaling
```

### Gradual Load Increase

```bash
#!/bin/bash
# Increase load gradually

for connections in 10 25 50 100 200; do
    echo "Testing with $connections connections..."
    wrk -t4 -c$connections -d30s https://your-api.railway.app/api/health
    sleep 10
done
```

## Optimization

### Frontend Optimization

#### Code Splitting

Next.js automatically handles dynamic imports:

```javascript
// Automatic code splitting
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

#### Image Optimization

Next.js Image component:

```javascript
import Image from 'next/image'

// Automatically optimizes, serves WebP, lazy loads
<Image
  src="/dashboard.png"
  width={500}
  height={300}
  priority={true}  // For above-fold images
/>
```

#### Bundle Analysis

```bash
cd frontend

# Analyze bundle size
npm install --save-dev @next/bundle-analyzer
# Add to next.config.js:
# const withBundleAnalyzer = require('@next/bundle-analyzer')()
# module.exports = withBundleAnalyzer({ /* next config */ })

npm run build  # Generates bundle report
```

### Backend Optimization

#### Connection Pooling

```python
# sqlalchemy with connection pooling
from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True  # Test connections before use
)
```

#### Caching

Add Redis for caching:

```bash
# Deploy Redis
railway add --name cache --image redis:7-alpine

# Set environment
railway variable set REDIS_URL="redis://cache:6379/0"
```

Backend caching:

```python
import redis

cache = redis.from_url(os.getenv("REDIS_URL"))

@app.get("/api/workflows")
async def get_workflows():
    # Try cache first
    cached = cache.get("workflows:all")
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    workflows = db.query(Workflow).all()
    
    # Cache for 5 minutes
    cache.setex("workflows:all", 300, json.dumps(workflows))
    return workflows
```

#### Database Query Optimization

```python
# Use select() for specific columns (not *)
from sqlalchemy import select

# BAD: Selects all columns
workflows = db.query(Workflow).all()

# GOOD: Select only needed columns
workflows = db.query(
    Workflow.id, 
    Workflow.name, 
    Workflow.status
).all()

# GOOD: Use eager loading to prevent N+1 queries
from sqlalchemy.orm import joinedload

workflows = db.query(Workflow).options(
    joinedload(Workflow.tasks)
).all()
```

### Infrastructure Optimization

#### CDN for Static Assets

Configure Railway with CDN:

1. Cloudflare integration (free)
2. S3 + CloudFront for static files
3. Bunny CDN for images

#### Database Query Cache

```python
# Cache expensive operations
from functools import lru_cache

@lru_cache(maxsize=128)
def get_user_workflows(user_id):
    return db.query(Workflow).filter(
        Workflow.user_id == user_id
    ).all()
```

## Error Tracking

### Configure Error Tracking

#### Sentry Setup

```python
# backend/app/main.py

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[
        FastApiIntegration(),
    ],
    traces_sample_rate=0.1,
    environment=os.getenv("ENV"),
    attach_stacktrace=True,
)
```

#### Frontend Error Tracking

```javascript
// frontend/pages/_app.tsx

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### Error Alerts

Configure Sentry alerts:

1. Go to Sentry project settings
2. Create alerts:
   - Error rate > 5%
   - Error in production
   - High volume errors
3. Notification channels:
   - Email
   - Slack
   - PagerDuty
   - Webhooks

## Health Checks

### Automatic Health Checks

Railway performs health checks every 30 seconds:

**Backend**: `GET /api/health`
```python
# backend/app/main.py
@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Check database
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "timestamp": datetime.now(),
            "services": {
                "api": "up",
                "database": "up"
            }
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 503
```

**Frontend**: `GET /` (basic HTTP 200)

**Database**: `pg_isready -U workflow_user`

### Manual Health Checks

```bash
# Check backend
curl https://your-api.railway.app/api/health

# Check frontend
curl https://your-frontend.railway.app

# Check database connectivity
railway run psql -c "SELECT 1" $DATABASE_URL
```

### Readiness Checks

```python
# Readiness check - ready to accept traffic
@app.get("/api/ready")
async def readiness(db: Session = Depends(get_db)):
    try:
        # Check all dependencies
        db.execute(text("SELECT 1"))
        # Check cache
        redis_conn.ping()
        return {"ready": True}
    except:
        return {"ready": False}, 503
```

## Alerting

### Set Up Alerts

#### Email Alerts

Railway dashboard:
1. Project settings → Notifications
2. Add email alerts for:
   - Deployment failures
   - Service crashes
   - High memory usage

#### Slack Alerts

```bash
# Create Slack webhook
# 1. Go to slack.com/api/apps
# 2. Create app → Incoming Webhooks
# 3. Copy webhook URL

# Add to Railway via environment variable
railway variable set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

#### Custom Alerts with Functions

```python
# Alert on high error rate
@app.middleware("http")
async def error_rate_monitor(request, call_next):
    response = await call_next(request)
    
    if response.status_code >= 400:
        error_count.inc()
        if error_count.get() > ERROR_THRESHOLD:
            send_alert("High error rate detected!")
    
    return response
```

### Alert Strategy

| Condition | Severity | Action |
|-----------|----------|--------|
| Service down | Critical | Page on-call engineer |
| Error rate > 5% | High | Slack alert + log |
| Response time > 2s | Medium | Log + monitor |
| CPU > 90% | High | Scale up + alert |
| Memory > 95% | Critical | Page engineer + restart |

## Monitoring Checklist

Daily:
- [ ] Check error rate in Sentry
- [ ] Review performance metrics
- [ ] Check disk usage

Weekly:
- [ ] Review slow queries
- [ ] Check API latency trends
- [ ] Review database metrics

Monthly:
- [ ] Capacity planning
- [ ] Update scaling policies
- [ ] Review cost optimization
- [ ] Load test before peak periods

## Resources

- **Railway Docs**: https://docs.railway.app
- **Sentry Setup**: https://docs.sentry.io
- **PostgreSQL Optimization**: https://wiki.postgresql.org/wiki/Performance_Optimization
- **Next.js Performance**: https://nextjs.org/docs/testing
- **FastAPI Performance**: https://fastapi.tiangolo.com/deployment/concepts/

---

**Last Updated**: 2026-02-09
**Version**: 1.0
