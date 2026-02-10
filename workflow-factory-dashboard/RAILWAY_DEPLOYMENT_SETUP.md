# Railway Deployment Setup Guide

## ✅ Pre-Deployment Checklist

Your Workflow Factory Dashboard has been prepared for Railway deployment. Here's what's ready:

### Repository
- ✅ GitHub repo created: `Gbenro/workflow-factory-dashboard`
- ✅ Code pushed to main branch
- ✅ CI/CD workflows configured

### Docker Configuration
- ✅ Frontend Dockerfile (Next.js multi-stage build)
- ✅ Backend Dockerfile (FastAPI multi-stage build)
- ✅ Docker Compose for local testing
- ✅ Railway.json configuration

### Services Ready for Deployment
1. **Frontend** (Next.js 14)
   - Port: 3000
   - Build command: `npm run build`
   - Start command: `npm run start`

2. **Backend** (FastAPI)
   - Port: 8000
   - Build command: Automatic from Dockerfile
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Database** (PostgreSQL 15)
   - Port: 5432
   - Image: `postgres:15-alpine`
   - Included in railway.json

---

## 🚀 Step-by-Step Deployment to Railway

### Option 1: Using Railway CLI (Recommended)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Authenticate with Railway
```bash
railway login
```
This will open a browser window. Log in with your Railway account.

#### 3. Navigate to Project
```bash
cd /home/ben/.openclaw/workspace/workflow-factory-dashboard
```

#### 4. Create Railway Project
```bash
railway init
```
Follow the prompts:
- Project name: `workflow-factory-dashboard`
- Select services you want to deploy

#### 5. Set Environment Variables
```bash
railway variables set DATABASE_URL "postgresql://workflow_user:workflow_password_123@postgres.railway.internal:5432/workflow_db"
railway variables set NEXT_PUBLIC_API_URL "https://workflow-factory-dashboard-api.railway.app"
railway variables set NEXT_PUBLIC_WS_URL "ws://workflow-factory-dashboard-api.railway.app"
railway variables set SECRET_KEY "your-secret-key-change-in-production"
```

#### 6. Deploy
```bash
railway up --detach
```

The deployment will:
1. Build your Docker images
2. Deploy the PostgreSQL database
3. Deploy the backend API
4. Deploy the frontend
5. Configure environment variables
6. Set up networking between services

### Option 2: Using Railway Dashboard (Web UI)

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select `Gbenro/workflow-factory-dashboard`
5. Configure services in the UI:
   - Frontend service → Next.js
   - Backend service → FastAPI
   - Postgres service → PostgreSQL 15
6. Set environment variables in the Railway dashboard
7. Deploy

### Option 3: Using Docker Compose (Local Testing)

```bash
cd /home/ben/.openclaw/workspace/workflow-factory-dashboard
docker-compose up -d
```

---

## 📝 Environment Variables Required

### Frontend (Next.js)
```
NEXT_PUBLIC_API_URL=https://workflow-factory-dashboard-api.railway.app
NEXT_PUBLIC_WS_URL=ws://workflow-factory-dashboard-api.railway.app
NODE_ENV=production
```

### Backend (FastAPI)
```
DATABASE_URL=postgresql://workflow_user:workflow_password_123@postgres.railway.internal:5432/workflow_db
PYTHONUNBUFFERED=1
ENV=production
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=https://workflow-factory-dashboard.railway.app
```

### PostgreSQL
```
POSTGRES_USER=workflow_user
POSTGRES_PASSWORD=workflow_password_123
POSTGRES_DB=workflow_db
```

---

## 🔗 Expected Deployment URLs

Once deployed to Railway, your services will be available at:

| Service | URL |
|---------|-----|
| **Frontend** | https://workflow-factory-dashboard.railway.app |
| **Backend Health** | https://workflow-factory-dashboard-api.railway.app/api/health |
| **API Docs** | https://workflow-factory-dashboard-api.railway.app/docs |
| **Database** | postgres.railway.internal:5432 |

---

## ✔️ Testing Your Deployment

### 1. Check Frontend Health
```bash
curl https://workflow-factory-dashboard.railway.app
# Expected: HTML response
```

### 2. Check Backend Health
```bash
curl https://workflow-factory-dashboard-api.railway.app/api/health
# Expected: {"status": "healthy"}
```

### 3. Check API Documentation
```bash
# Visit in browser:
https://workflow-factory-dashboard-api.railway.app/docs
```

### 4. Database Connection
```bash
# From Railway CLI or dashboard, verify database is running
railway db shell
# Should connect to postgres database
```

### 5. Test WebSocket Connection
```bash
# Visit the frontend and check browser console
# Should see WebSocket connection to the API
```

---

## 📊 Monitoring & Logs

### View Logs in Railway CLI
```bash
# All services
railway logs

# Specific service
railway logs -s backend
railway logs -s frontend
railway logs -s postgres
```

### View in Railway Dashboard
1. Go to your project in Railway
2. Click on each service
3. View logs in the "Logs" tab

---

## 🔐 Security Configuration

### Before Production Deployment
1. Change `SECRET_KEY` in backend environment variables
2. Change `POSTGRES_PASSWORD` to a strong password
3. Set proper `CORS_ORIGINS` for your domain
4. Enable SSL/TLS (Railway provides this automatically)
5. Configure database backups
6. Set up monitoring and alerts

### Recommended Settings
- Enable auto-redeploy on GitHub push
- Set up staging and production environments
- Configure database backups
- Monitor resource usage
- Set up log aggregation

---

## 🐛 Troubleshooting

### Service Won't Start
1. Check logs: `railway logs -s <service>`
2. Verify environment variables are set
3. Check Docker image builds: `railway service build --detach`
4. Review startup commands in railway.json

### Database Connection Error
1. Verify DATABASE_URL environment variable
2. Check PostgreSQL is running: `railway logs -s postgres`
3. Ensure database migrations ran
4. Check CORS configuration

### Frontend Can't Connect to API
1. Verify NEXT_PUBLIC_API_URL matches backend URL
2. Check backend CORS_ORIGINS setting
3. Check network connectivity
4. Review browser console for errors

### Build Failures
1. Check Dockerfile syntax
2. Verify all required files are in git
3. Review build logs: `railway logs --service backend`
4. Check for missing dependencies in requirements.txt or package.json

---

## 📚 Additional Resources

- [Railway Documentation](https://railway.app/docs)
- [Railway CLI Reference](https://railway.app/docs/cli/install)
- [Docker Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Project Architecture](./docs/ARCHITECTURE.md)

---

## ✨ What's Included

This deployment includes:

- ✅ Multi-stage Docker builds for optimization
- ✅ Health checks for all services
- ✅ Non-root user execution (security)
- ✅ Environment variable management
- ✅ PostgreSQL persistence with volumes
- ✅ WebSocket support
- ✅ CORS configuration
- ✅ Database migrations (Alembic)
- ✅ Production-ready configurations
- ✅ GitHub integration ready

---

## 🎯 Next Steps

1. Install Railway CLI: `npm install -g @railway/cli`
2. Authenticate: `railway login`
3. Deploy: `railway up` from the project directory
4. Monitor: `railway logs`
5. Test: Access the frontend URL and verify functionality

**Estimated deployment time: 3-5 minutes**

---

## ❓ Support

For issues or questions:
1. Check Railway logs: `railway logs`
2. Review [Railway documentation](https://railway.app/docs)
3. Check project README: `./README.md`
4. Review deployment guide: `./RAILWAY_DEPLOYMENT.md`
