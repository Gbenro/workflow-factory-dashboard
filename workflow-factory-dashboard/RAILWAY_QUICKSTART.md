# Railway Deployment - Quick Start (5 Minutes)

Get the Workflow Factory Dashboard running on Railway in 5 minutes.

## Prerequisites

- Railway account (free at [railway.app](https://railway.app))
- Node.js 18+ installed
- Git repository set up

## Step 1: Install Railway CLI (1 min)

```bash
npm install -g @railway/cli
railway login
```

## Step 2: Create Railway Project (1 min)

```bash
cd /path/to/workflow-factory-dashboard
railway init
```

Follow prompts to create new project named "workflow-factory-dashboard"

Save your project ID (you'll need it)

## Step 3: Set Environment Variables (1 min)

```bash
# Set critical variables
railway variable set SECRET_KEY="$(openssl rand -hex 32)"
railway variable set CORS_ORIGINS="https://YOUR_DOMAIN.railway.app"
railway variable set NEXT_PUBLIC_API_URL="https://YOUR_API_DOMAIN.railway.app"
```

**Copy these from Railway dashboard** (PostgreSQL service will auto-generate):
```
DATABASE_URL=postgresql://workflow_user:PASSWORD@postgres:5432/workflow_factory
POSTGRES_USER=workflow_user
POSTGRES_PASSWORD=PASSWORD
POSTGRES_DB=workflow_factory
```

Go to Railway dashboard → PostgreSQL service → "Variables" to find actual values

## Step 4: Deploy (2 min)

```bash
# Option A: Use deployment script
./scripts/deploy-to-railway.sh --project-id YOUR_PROJECT_ID

# Option B: Use Railway CLI directly
railway up --projectId YOUR_PROJECT_ID
```

## Step 5: Verify Deployment (1 min)

Check status:
```bash
railway status
railway logs -f
```

Visit:
- Frontend: `https://YOUR_DOMAIN-frontend.railway.app`
- Backend API: `https://YOUR_DOMAIN-backend.railway.app/api/health`

## 🎉 Done!

Your app is deployed and running on Railway.

---

## Next Steps

### View Logs
```bash
railway logs -f --service backend
railway logs -f --service frontend
```

### Run Database Migrations
```bash
railway run alembic upgrade head
```

### Set Custom Domain
1. Railway dashboard → Project → Settings
2. Add domain
3. Update DNS records (CNAME)

### Scale Application
```bash
railway variable set RAILWAY_REPLICAS=2 --service backend
```

---

## Troubleshooting

### Check Status
```bash
railway status
```

### View Full Logs
```bash
railway logs -f --limit 200
```

### Test Database
```bash
railway run psql -c "SELECT 1" $DATABASE_URL
```

### Redeploy
```bash
railway up --force
```

### Need Help?
See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) → Troubleshooting

---

## Environment Variables Needed

### Backend
- `DATABASE_URL` - PostgreSQL connection string (auto from Railway)
- `SECRET_KEY` - Random 32+ character string (generate with openssl rand -hex 32)
- `CORS_ORIGINS` - Frontend domain
- `ENV` - production

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NODE_ENV` - production

### PostgreSQL (auto-set by Railway)
- `POSTGRES_USER` - workflow_user
- `POSTGRES_PASSWORD` - Strong password
- `POSTGRES_DB` - workflow_factory

---

## Automatic Deployment (Optional)

Automatically deploy when you push to `main`:

1. Add GitHub Actions secrets:
```bash
gh secret set RAILWAY_TOKEN -b "YOUR_TOKEN"
gh secret set RAILWAY_PROJECT_ID -b "YOUR_PROJECT_ID"
gh secret set RAILWAY_DOMAIN -b "your-domain.railway.app"
gh secret set RAILWAY_BACKEND_URL -b "https://backend.railway.app"
gh secret set RAILWAY_FRONTEND_URL -b "https://frontend.railway.app"
```

2. Push to main:
```bash
git push origin main
```

GitHub Actions will automatically:
- Run tests
- Build images
- Deploy to Railway
- Health check
- Rollback on failure

---

## Common Commands

```bash
# View services
railway service list

# View service info
railway service info --service backend

# Connect to database
railway connect --service postgres

# View all variables
railway variable list

# Set variable
railway variable set VAR_NAME="value"

# View deployment history
railway history

# Rollback to previous deployment
railway rollback

# View real-time logs
railway logs -f
```

---

## Command Reference

| Task | Command |
|------|---------|
| Check status | `railway status` |
| Deploy | `railway up` |
| View logs | `railway logs -f` |
| List services | `railway service list` |
| Set variable | `railway variable set KEY="value"` |
| View variables | `railway variable list` |
| Connect to DB | `railway connect --service postgres` |
| Run command | `railway run COMMAND` |
| Rollback | `railway rollback` |

---

## Help

- **Full Deployment Guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- **Environment Variables**: [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)
- **CLI Commands**: [docs/RAILWAY_QUICK_REFERENCE.md](./docs/RAILWAY_QUICK_REFERENCE.md)
- **Scaling & Monitoring**: [docs/SCALING_AND_MONITORING.md](./docs/SCALING_AND_MONITORING.md)
- **Railway Docs**: https://docs.railway.app

---

**Happy deploying! 🚀**
