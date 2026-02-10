# Deployment Documentation

This directory contains all guides and references for deploying the Workflow Factory Dashboard.

## 📚 Documentation Files

### Getting Started
- **[RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)** - Complete Railway deployment guide
  - Quick start (5 minutes)
  - Prerequisites and setup
  - Environment variables
  - Deployment methods (GitHub Actions, CLI, manual)
  - Database management
  - **👉 START HERE**

### Reference Guides
- **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - Complete environment variables reference
  - All variables by service (backend, frontend, database)
  - How to set variables (3 methods)
  - Environment-specific configurations
  - Security best practices
  - Troubleshooting missing variables

- **[SCALING_AND_MONITORING.md](./SCALING_AND_MONITORING.md)** - Production scaling and monitoring guide
  - Horizontal and vertical scaling strategies
  - Performance monitoring setup
  - Load testing procedures
  - Optimization techniques
  - Error tracking (Sentry)
  - Health checks and alerting

- **[RAILWAY_QUICK_REFERENCE.md](./RAILWAY_QUICK_REFERENCE.md)** - Quick command reference
  - Common Railway CLI commands
  - Commands organized by task
  - Tips & tricks (aliases, automation)
  - Troubleshooting common issues

## 🚀 Quick Navigation

### I want to...

**Deploy to Railway for the first time**
→ [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Quick Start" section

**Set up environment variables**
→ [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) → "Setting Environment Variables"

**Understand what variables I need**
→ [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) → "Backend Variables" / "Frontend Variables"

**Deploy automatically with GitHub Actions**
→ [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Deployment Methods" → "GitHub Actions"

**Run a manual deployment**
→ Use `./scripts/deploy-to-railway.sh` or follow [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Method 3: Manual Railway CLI"

**View my application logs**
→ [RAILWAY_QUICK_REFERENCE.md](./RAILWAY_QUICK_REFERENCE.md) → "Monitoring & Logs" section

**Scale my application**
→ [SCALING_AND_MONITORING.md](./SCALING_AND_MONITORING.md) → "Scaling Strategy"

**Monitor performance**
→ [SCALING_AND_MONITORING.md](./SCALING_AND_MONITORING.md) → "Performance Monitoring"

**Fix a deployment problem**
→ [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Troubleshooting" section

**Run database migrations**
→ [RAILWAY_QUICK_REFERENCE.md](./RAILWAY_QUICK_REFERENCE.md) → "Database Operations" section

## 🔧 Tools & Scripts

### Deployment Script

Location: `./scripts/deploy-to-railway.sh`

Handles deployment with checks and monitoring:

```bash
./scripts/deploy-to-railway.sh --project-id YOUR_PROJECT_ID
```

Features:
- ✓ Prerequisite checking (Railway CLI, git, curl)
- ✓ Project file validation
- ✓ Git status checking
- ✓ Docker image building
- ✓ Deployment to Railway
- ✓ Database migrations
- ✓ Health checks
- ✓ Deployment summary

See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Deployment Methods" → "CLI Deployment Script"

### Configuration Files

#### railway.json
Defines services, health checks, and environment variables for Railway.

#### .railwayignore
Specifies files/directories to exclude from Railway builds.

#### .env.railway
Template for environment variables needed in Railway.

## 🌐 Deployment Methods

### 1. GitHub Actions (Automatic) ⭐ Recommended
- Triggers on push to `main` branch
- Automatic deployment + health checks
- Auto-rollback on failure
- Status reporting in pull requests

Setup: See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "GitHub Actions"

### 2. CLI Script (Manual)
- `./scripts/deploy-to-railway.sh`
- Full validation and error checking
- Good for ad-hoc deployments
- Options for skipping migrations, validation-only mode

### 3. Railway Dashboard (Manual)
- Web-based deployment via railroad.app
- Click "Deploy" after environment setup
- Visual progress tracking
- Good for quick deployments

### 4. Railway CLI (Direct)
- `railway up` command
- Fastest for experienced users
- Minimal validation
- Best for debugging

See [RAILWAY_QUICK_REFERENCE.md](./RAILWAY_QUICK_REFERENCE.md) for CLI commands

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Railway dashboard
- [ ] Database migrations tested
- [ ] Frontend API URLs point to correct backend
- [ ] Backend CORS allows frontend domain
- [ ] Secrets rotated (SECRET_KEY, database password)
- [ ] Error tracking (Sentry) configured
- [ ] Health checks verified
- [ ] SSL certificate configured (automatic on Railway)
- [ ] Custom domain configured (if used)
- [ ] Team access granted in Railway
- [ ] Backup strategy documented

See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Deployment Checklist"

## 🔒 Security Notes

### Secrets Management
- ✓ Store all secrets in Railway Variables (not code)
- ✓ Use strong passwords (32+ characters)
- ✗ Never commit `.env` files
- ✗ Never share credentials via email/chat

### CORS Configuration
Set `CORS_ORIGINS` to allow only your frontend domain:
```
CORS_ORIGINS=https://your-domain.railway.app
```

### SSL/TLS
Railway provides automatic SSL certificates - no action needed!

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) → "Security Best Practices"

## 🆘 Getting Help

### Documentation
1. Check relevant guide above
2. See "Troubleshooting" section in [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)
3. Review [RAILWAY_QUICK_REFERENCE.md](./RAILWAY_QUICK_REFERENCE.md)

### External Resources
- **Railway Docs**: https://docs.railway.app
- **Railway Community**: https://community.railway.app
- **Railway Status**: https://status.railway.app
- **GitHub Issues**: Search project for deployment issues

### Common Issues

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check backend logs: `railway logs -f --service backend` |
| Database connection error | Verify `DATABASE_URL` variable is set |
| CORS errors | Check `CORS_ORIGINS` matches frontend domain |
| Slow deployment | Check Railway status page for incidents |
| Stuck migrations | Connect to database and check migration status |

See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Troubleshooting" for detailed solutions

## 📈 Next Steps

After successful deployment:

1. **Monitor** - Check logs and metrics regularly
2. **Set up alerting** - Configure error tracking (Sentry)
3. **Plan scaling** - Review [SCALING_AND_MONITORING.md](./SCALING_AND_MONITORING.md)
4. **Configure custom domain** - See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) → "Advanced Configuration"
5. **Set up backups** - Already automatic on Railway
6. **Document runbook** - Create team runbook from these guides

## 📝 File Structure

```
workflow-factory-dashboard/
├── RAILWAY_DEPLOYMENT.md           # Main deployment guide
├── .env.railway                    # Environment variables template
├── railway.json                    # Railway service configuration
├── .railwayignore                  # Build exclusions
├── .github/workflows/
│   ├── ci.yml                      # Testing workflow
│   └── railway-deploy.yml          # Deployment workflow
├── scripts/
│   └── deploy-to-railway.sh        # Deployment script
├── docs/
│   ├── DEPLOYMENT_README.md        # This file
│   ├── ENVIRONMENT_VARIABLES.md    # Variables reference
│   ├── SCALING_AND_MONITORING.md   # Scaling guide
│   └── RAILWAY_QUICK_REFERENCE.md  # CLI reference
├── backend/
│   └── Dockerfile                  # Optimized backend build
├── frontend/
│   └── Dockerfile                  # Optimized frontend build
└── docker-compose.yml              # Local development setup
```

## 🎯 Success Criteria

Deployment is successful when:

1. ✓ Services running in Railway dashboard
2. ✓ Frontend accessible at https://your-domain-frontend.railway.app
3. ✓ Backend API responding at https://your-domain-backend.railway.app/api/health
4. ✓ Database migrations completed
5. ✓ Health checks passing
6. ✓ No errors in logs
7. ✓ Application responsive and functional

## 📞 Support

- **Internal**: Check deployment logs via Railway CLI
- **External**: Railway community.railway.app
- **Emergency**: Railway support@railway.app

---

**Last Updated**: 2026-02-09
**Version**: 1.0

**Start with**: [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)
