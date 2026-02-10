# Workflow Factory Dashboard

A real-time collaborative dashboard for managing AI agent workflows, tasks, and team collaboration. Built for teams that combine AI agents with human oversight.

## Vision

Workflow Factory Dashboard bridges the gap between **autonomous AI agents** and **human managers**. It provides:

- **Real-time Workflow Monitoring** – Watch agents execute tasks in live dashboards
- **Collaborative Task Management** – Drag-and-drop Kanban boards with human-agent collaboration
- **Suggestion & Feedback Loop** – Agents suggest actions; humans provide feedback
- **Production Ready** – WebSocket support, database-backed persistence, mobile responsive
- **Developer Friendly** – Open-source, TypeScript + Python stack, easy to extend

## Features

✅ **Dashboard**
- Real-time workflow status (active, completed, failed)
- Agent performance metrics
- Task queue visualization
- System health monitoring

✅ **Project Manager Interface**
- Drag-and-drop task board (Kanban)
- Multi-stage workflow pipelines
- Priority and due date management
- Task assignment to agents

✅ **Collaboration Pane**
- Agent suggestions for actions
- Human feedback & approvals
- Discussion threads per task
- Audit trail for all decisions

✅ **Mobile Responsive**
- Tailwind CSS for responsive design
- Works on tablet, mobile, desktop
- Real-time sync across devices

✅ **Backend API**
- FastAPI with async support
- WebSocket for real-time updates
- PostgreSQL/Supabase integration
- RESTful endpoints for workflows, agents, tasks, suggestions

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React, SSR)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Real-time:** WebSocket client
- **State:** React Context + hooks
- **Components:** Shadcn/ui

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Real-time:** WebSockets
- **Database:** PostgreSQL / Supabase
- **ORM:** SQLAlchemy
- **Async:** ASGI with Uvicorn
- **Docs:** Auto-generated OpenAPI/Swagger

### Deployment Ready
- Docker & Docker Compose for local dev
- Environment-based config
- Database migrations
- Health checks

## Quick Start

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.11+ (backend)
- PostgreSQL 14+ (database) or Supabase account
- Docker & Docker Compose (optional, for easy setup)

### Development Setup

#### Option 1: Using Docker Compose (Recommended)

```bash
cd workflow-factory-dashboard

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Swagger Docs: http://localhost:8000/docs
```

#### Option 2: Manual Setup

**Backend (FastAPI)**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
export DATABASE_URL="postgresql://user:password@localhost:5432/workflow_factory"
alembic upgrade head

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (Next.js)**
```bash
cd frontend

# Install dependencies
npm install

# Set environment
cp .env.example .env.local

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
workflow-factory-dashboard/
├── frontend/                 # Next.js 14 application
│   ├── app/                 # App router
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── workflows/       # Workflow management
│   │   ├── tasks/           # Task board
│   │   └── api/            # API routes (if needed)
│   ├── components/          # Reusable React components
│   │   ├── dashboard/
│   │   ├── taskboard/
│   │   ├── collaboration/
│   │   └── shared/
│   ├── lib/                # Utilities, hooks, WebSocket client
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript types
│   └── package.json
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # App entry point
│   │   ├── api/            # API endpoints (workflows, agents, tasks, suggestions)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── websockets/     # WebSocket handlers
│   │   └── db/             # Database setup
│   ├── migrations/         # Alembic migrations
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── MOCK_DATA.md        # Example workflows & data
│
├── .github/
│   ├── ISSUE_TEMPLATE/     # GitHub issue templates
│   └── workflows/          # GitHub Actions CI/CD
│
├── docker-compose.yml
├── README.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── LICENSE (MIT)
└── .gitignore
```

## API Documentation

### WebSocket Events

The backend streams real-time updates via WebSocket at `/ws`:

**Client → Server:**
```json
{
  "action": "subscribe",
  "channel": "workflows"  // workflows, agents, tasks, suggestions
}
```

**Server → Client:**
```json
{
  "type": "workflow_update",
  "data": {
    "id": "wf-123",
    "status": "running",
    "progress": 65,
    "agents": [{"id": "agent-1", "status": "executing_task"}]
  }
}
```

### REST Endpoints

- `GET /api/workflows` – List workflows
- `POST /api/workflows` – Create workflow
- `GET /api/workflows/{id}` – Get workflow details
- `GET /api/agents` – List agents
- `GET /api/tasks` – List tasks
- `POST /api/tasks` – Create task
- `POST /api/suggestions` – Submit suggestion
- `POST /api/suggestions/{id}/approve` – Approve suggestion
- `GET /api/health` – Health check

See [docs/API.md](docs/API.md) for complete details.

## Mock Data

The project includes sample workflows and agents for testing:

- **Workflow:** "Customer Support Automation"
- **Agents:** TicketAnalyzer, EmailResponder, EscalationManager
- **Tasks:** Classify, Draft Response, Send, Escalate (if needed)
- **Status:** Real-time updates showing agent progress

See [docs/MOCK_DATA.md](docs/MOCK_DATA.md) for examples.

## Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/workflow-factory-dashboard
   cd workflow-factory-dashboard
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes** (follow [CONTRIBUTING.md](CONTRIBUTING.md))

4. **Test locally** with Docker Compose

5. **Push & open PR**

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for:
- 12-week development plan
- Upcoming features
- Community priorities
- Release schedule

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code standards
- Testing guidelines
- PR process

## License

MIT License – See [LICENSE](LICENSE) file for details.

## Support

- 📖 **Docs:** [/docs](docs/)
- 🐛 **Issues:** [GitHub Issues](https://github.com/Gbenro/workflow-factory-dashboard/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Gbenro/workflow-factory-dashboard/discussions)

## Maintainers

- Ben Gbenro ([@Gbenro](https://github.com/Gbenro))

---

**Built with ❤️ for teams mixing human + AI workflows.**
