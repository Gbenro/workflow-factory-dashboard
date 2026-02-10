# 🚀 Quick Start: Deploy to Railway in 5 Minutes

## Prerequisites
- ✅ GitHub account with access to Gbenro/workflow-factory-dashboard
- ✅ Railway.app account
- ✅ Railway CLI installed: `npm install -g @railway/cli`

## Quick Deploy (CLI)

```bash
# 1. Navigate to project
cd /home/ben/.openclaw/workspace/workflow-factory-dashboard

# 2. Login to Railway
railway login

# 3. Initialize project
railway init --name workflow-factory-dashboard

# 4. Deploy!
railway up --detach

# 5. Watch deployment
railway logs

# 6. Get URLs
railway domains
```

## Quick Deploy (Web UI)

1. Visit https://railway.app
2. Create new project → Deploy from GitHub
3. Select `Gbenro/workflow-factory-dashboard`
4. Click deploy
5. Add environment variables from `.env.production`
6. Done! 🎉

## After Deployment

### Frontend URL
https://workflow-factory-dashboard.railway.app

### Backend API URL
https://workflow-factory-dashboard-api.railway.app

### API Docs
https://workflow-factory-dashboard-api.railway.app/docs

### Health Check
```bash
curl https://workflow-factory-dashboard-api.railway.app/api/health
```

## Environment Variables to Set

Copy from `.env.production`:
```
NEXT_PUBLIC_API_URL=https://workflow-factory-dashboard-api.railway.app
NEXT_PUBLIC_WS_URL=ws://workflow-factory-dashboard-api.railway.app
DATABASE_URL=postgresql://workflow_user:workflow_password_123@postgres.railway.internal:5432/workflow_db
SECRET_KEY=your-secure-secret-key
CORS_ORIGINS=https://workflow-factory-dashboard.railway.app
```

## Verify Deployment

### 1. Frontend is Up
```bash
curl https://workflow-factory-dashboard.railway.app
```

### 2. API is Healthy
```bash
curl https://workflow-factory-dashboard-api.railway.app/api/health
# Output: {"status":"healthy"}
```

### 3. Visit Dashboard
Open in browser: https://workflow-factory-dashboard.railway.app

### 4. Check API Docs
https://workflow-factory-dashboard-api.railway.app/docs

## Troubleshooting

### Services not starting?
```bash
railway logs
```

### Need to set variables?
```bash
railway variables set VARIABLE_NAME value
```

### Rebuild services?
```bash
railway service build --detach
```

### View all services
```bash
railway service list
```

---

**Full setup guide:** See `RAILWAY_DEPLOYMENT_SETUP.md`

**Estimated time:** 3-5 minutes ⏱️
