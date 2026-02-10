# Quick Start Guide

Get Workflow Factory Dashboard running in 5 minutes.

## Prerequisites

- Docker & Docker Compose installed
- OR Node.js 18+ and Python 3.11+

## Option 1: Docker Compose (Easiest)

```bash
# 1. Clone/navigate to project
cd workflow-factory-dashboard

# 2. Start services
docker-compose up -d

# 3. Wait for startup (~30 seconds)
docker-compose logs -f

# 4. Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Database UI: http://localhost:8080 (user/password/workflow_factory)
```

**That's it!** You have a fully working system with database.

## Option 2: Manual Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database (requires PostgreSQL running locally)
export DATABASE_URL="postgresql://user:password@localhost:5432/workflow_factory"
alembic upgrade head

# Start server
uvicorn app.main:app --reload

# API available at http://localhost:8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set environment
cp .env.example .env.local

# Start dev server
npm run dev

# Open http://localhost:3000
```

## What You Get

### Dashboard
- Real-time workflow status monitoring
- Agent performance metrics
- System health checks
- Task progress tracking

### API
- RESTful endpoints for workflows, agents, tasks, suggestions
- Real-time WebSocket updates
- Auto-generated Swagger documentation
- Mock data for testing

### Database
- PostgreSQL with sample data
- Automated schema migrations
- Ready for production

## File Structure Quick Ref

```
├── frontend/              → Next.js 14 app (React, TypeScript, Tailwind)
├── backend/               → FastAPI Python app (SQLAlchemy ORM)
├── docs/                  → Documentation (API, Architecture, Deployment)
├── .github/               → GitHub templates (issues, PRs, CI/CD)
├── docker-compose.yml     → Local development stack
├── Makefile               → Convenient commands
└── README.md              → Full project documentation
```

## Common Commands

```bash
# Using Docker Compose
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f backend # View backend logs
docker-compose ps              # Check service status

# Using Make
make help          # Show all available commands
make dev           # Start dev environment
make test          # Run all tests
make docker-up     # Start with Docker Compose
make docker-down   # Stop services

# Manual backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Manual frontend
cd frontend
npm install
npm run dev
```

## Test the API

### Using Browser
```
http://localhost:8000/docs  → Interactive Swagger UI
http://localhost:8000/redoc → Alternative ReDoc UI
```

### Using curl
```bash
# Get health
curl http://localhost:8000/api/health

# List workflows
curl http://localhost:8000/api/workflows

# List agents
curl http://localhost:8000/api/agents
```

### Using WebSocket
```bash
# Install wscat
npm install -g wscat

# Connect
wscat -c ws://localhost:8000/ws

# Subscribe to updates
{"action": "subscribe", "channel": "workflows"}

# Press Enter and watch for real-time updates
```

## Database Access

### Using Adminer (Easy)
```
URL: http://localhost:8080
Server: postgres
User: workflow_user
Password: workflow_password
Database: workflow_factory
```

### Using psql (Terminal)
```bash
psql postgresql://workflow_user:workflow_password@localhost:5432/workflow_factory
```

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://workflow_user:workflow_password@localhost:5432/workflow_factory
SECRET_KEY=dev-secret-key
DEBUG=true
```

## Next Steps

1. **Explore the Dashboard**
   - Visit http://localhost:3000
   - Check out workflows, agents, and tasks

2. **Try the API**
   - Go to http://localhost:8000/docs
   - Create workflows, tasks, and suggestions

3. **Read the Docs**
   - [README.md](README.md) – Project overview
   - [docs/API.md](docs/API.md) – Full API reference
   - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – System design
   - [CONTRIBUTING.md](CONTRIBUTING.md) – How to contribute

4. **Development**
   - Make code changes
   - Tests automatically run (in Docker)
   - Frontend hot-reloads on file save
   - Backend hot-reloads with `--reload` flag

5. **Deployment**
   - See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
   - Deploy to Vercel (frontend) or Railway (backend)
   - Or use Docker images

## Troubleshooting

### Docker Issues

**Port already in use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Or use docker-compose to remove containers
docker-compose down -v
```

**Services not starting**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Database Issues

**Connection error**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string in .env
echo $DATABASE_URL
```

**Migration failed**
```bash
# See current migration status
alembic current

# Reset migrations (⚠️ deletes data)
alembic downgrade base
alembic upgrade head
```

### API Issues

**404 on API calls**
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check frontend .env.local has correct API URL
cat frontend/.env.local
```

**WebSocket connection fails**
```bash
# Check WebSocket URL in frontend/.env.local
cat frontend/.env.local

# Check backend is listening
netstat -an | grep 8000
```

## Getting Help

- 📖 Check [documentation](docs/)
- 💬 Open a [discussion](https://github.com/Gbenro/workflow-factory-dashboard/discussions)
- 🐛 Report [issues](https://github.com/Gbenro/workflow-factory-dashboard/issues)
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) for contributing

## What's Next?

- ✅ **Phase 1 (Done):** Core setup and API scaffolding
- 📋 **Phase 2 (In Progress):** Task board and collaboration features
- 🚀 **Phase 3 (Coming):** Authentication, advanced features

See [ROADMAP.md](ROADMAP.md) for full development plan.

---

**Ready to build? Start with Docker Compose above! 🚀**
