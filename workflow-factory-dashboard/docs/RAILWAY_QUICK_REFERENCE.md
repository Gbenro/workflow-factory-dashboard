# Railway CLI Quick Reference Card

Quick reference for common Railway CLI commands used in development and deployment.

## Authentication

```bash
# Login to Railway
railway login

# Logout
railway logout

# Check who you're logged in as
railway whoami
```

## Project Management

```bash
# Initialize new project
railway init

# Create new project
railway init --name "workflow-factory"

# Set default project
railway link --projectId PROJECT_ID

# Show current project info
railway status

# List all projects
railway service list
```

## Service Management

```bash
# Show service info
railway service info --service backend

# List all services
railway service list

# Connect to service shell
railway shell --service backend

# View service logs
railway logs --service backend
railway logs -f --service backend  # Follow logs
railway logs --limit 100 --service backend  # Last 100 lines
```

## Deployment

```bash
# Deploy current project
railway up

# Force redeploy (no cache)
railway up --force

# Deploy specific service
railway up --service backend

# Deploy with detach (don't wait)
railway up --detach

# View deployment history
railway history
railway history --limit 20
```

## Database Operations

```bash
# Connect to database shell
railway connect --service postgres

# Run database command
railway run psql -c "SELECT * FROM workflows;" $DATABASE_URL

# Run migrations
railway run alembic upgrade head
railway run alembic current

# List tables
railway run psql -c "\dt" $DATABASE_URL

# Backup database (via Railway)
railway backup --service postgres

# View backups
railway backup list --service postgres
```

## Environment Variables

```bash
# List all variables
railway variable list

# Get specific variable
railway variable get SECRET_KEY

# Set variable
railway variable set SECRET_KEY="your-secret-key"

# Set from file
railway variable set -f .env.production

# Delete variable
railway variable unset SECRET_KEY

# Edit variable interactively
railway variable update
```

## Monitoring & Logs

```bash
# Real-time logs
railway logs -f

# Logs from specific service
railway logs -f --service backend
railway logs -f --service frontend
railway logs -f --service postgres

# Logs since time
railway logs --since "10 minutes ago"
railway logs --since "1 hour ago"

# Logs until time
railway logs --until "5 minutes ago"

# Combine filters
railway logs -f --service backend --since "30 minutes ago"

# Check status
railway status
railway status --projectId PROJECT_ID
```

## Rollback

```bash
# Rollback to previous deployment
railway rollback

# Rollback specific service
railway rollback --service backend

# View deployment history (to see what to rollback to)
railway history
```

## Networking

```bash
# Get service URL
railway link --projectId PROJECT_ID

# View exposed ports
railway service info --service backend

# View public domains
railway domain list

# Add custom domain
railway domain create --domain yourdomain.com

# Remove custom domain
railway domain delete --domain yourdomain.com
```

## Team & Access

```bash
# List project members
railway member list

# Add member
railway member add user@example.com

# Remove member
railway member remove user@example.com

# Manage permissions
railway role set USER_ID admin
railway role set USER_ID viewer
```

## Commands by Task

### Deploy Changes

```bash
# After code changes
git add .
git commit -m "Feature: Add new workflow"
git push origin main
railway up --projectId PROJECT_ID
railway logs -f
```

### Update Environment Variables

```bash
# Set new variable
railway variable set API_KEY="new-value"

# Verify set
railway variable get API_KEY

# Redeploy to apply
railway up --force
```

### Run One-Time Tasks

```bash
# Database migration
railway run alembic upgrade head

# Admin script
railway run python -m backend.scripts.admin_task

# Database query
railway run psql -c "UPDATE users SET active=true;" $DATABASE_URL
```

### Debug Issues

```bash
# Check status
railway status

# View full logs
railway logs --limit 200 --service backend

# Check environment
railway variable list

# Connect and debug
railway shell --service backend
python  # Python shell for debugging
exit

# Check database
railway connect --service postgres
select version();
```

### Performance Monitoring

```bash
# Check resource usage
railway status

# View metrics (shows CPU, memory, network)
# Go to Railway dashboard → Service → Metrics

# View detailed logs for slow requests
railway logs -f | grep "duration"

# Check error rate
railway logs | grep -i "error" | wc -l
```

### Manage Replicas & Scaling

```bash
# Set number of instances
railway variable set RAILWAY_REPLICAS=3 --service backend

# Upgrade instance type
# Go to Railway dashboard → Service → Settings → Plan

# View resource limits
railway service info
```

## Option Flags Reference

```bash
# Common flags
-f, --follow          Follow logs in real-time
--limit N             Show last N lines/items
--since "TIME"        Logs since specific time
--until "TIME"        Logs until specific time
-s, --service NAME    Specify service
--force               Force action without confirmation
--detach              Don't wait for completion

# Project/Service flags
--projectId ID        Specify project (if not linked)
--environmentId ID    Specify environment
--workspaceId ID      Specify workspace

# Output flags
--json                JSON output format
-q, --quiet           Minimal output
-v, --verbose         Detailed output
```

## Environment Variable Access in Commands

```bash
# Use variables in commands
railway run echo $DATABASE_URL
railway run echo $SECRET_KEY

# Run script with variables available
railway run ./scripts/deploy-to-railway.sh

# Use in complex commands
railway run bash -c "psql $DATABASE_URL -c 'SELECT count(*) FROM workflows;'"
```

## Interactive Shell

```bash
# Start interactive shell in service
railway shell --service backend

# Inside shell, all commands run in service context
# Type 'exit' to return to host

# Useful for debugging
python -c "from app.models import Workflow; print(Workflow.__table__.columns)"
```

## Tips & Tricks

### Alias for Faster Typing

```bash
# Add to ~/.bashrc or ~/.zshrc
alias rly="railway"
alias rlylogs="railway logs -f"
alias rlyup="railway up --force"
alias rlystatus="railway status"

# Now use
rly logs -f
rlystatus
```

### Save Project ID

```bash
# Link project (saves ID locally)
railway link --projectId YOUR_PROJECT_ID

# Now these work without --projectId
railway status
railway logs -f
```

### Get Service URLs Automatically

```bash
# Function to get URLs
function railway-urls() {
    echo "Frontend: $(railway service info --service frontend | grep URL)"
    echo "Backend: $(railway service info --service backend | grep URL)"
}

railway-urls
```

### Monitor in Watch

```bash
# Watch logs update every 2 seconds
watch -n 2 'railway logs --limit 50 --service backend'

# Watch status
watch railway status
```

## Common Issues & Solutions

### Command Not Found

```bash
# Railway CLI not installed
npm install -g @railway/cli

# Verify
railway --version
```

### Not Logged In

```bash
# Error: "Not authenticated"
railway login

# Verify
railway whoami
```

### Wrong Project

```bash
# Link correct project
railway link --projectId CORRECT_PROJECT_ID

# Verify
railway status
```

### Can't Connect to Database

```bash
# Check DATABASE_URL set
railway variable get DATABASE_URL

# Test connection
railway run psql $DATABASE_URL -c "SELECT 1"
```

### Deployment Stuck

```bash
# View logs to see what's stuck
railway logs -f --limit 100

# Cancel and rollback
railway rollback

# Force redeploy
railway up --force
```

## Getting Help

```bash
# General help
railway help

# Command help
railway logs --help
railway variable --help

# Online docs
# https://docs.railway.app

# Community
# https://community.railway.app
```

## Related Documentation

- **Full Guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- **Environment Variables**: [docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)
- **Scaling & Monitoring**: [docs/SCALING_AND_MONITORING.md](./docs/SCALING_AND_MONITORING.md)
- **Railway Docs**: https://docs.railway.app
- **Railway CLI Docs**: https://docs.railway.app/cli/commands

---

**Last Updated**: 2026-02-09
**Version**: 1.0
