# Backend: Workflow Factory Dashboard API

FastAPI-based REST + WebSocket API for real-time workflow management.

## Features

- **FastAPI** – Modern async Python framework
- **PostgreSQL** – Reliable relational database
- **SQLAlchemy** – Async ORM for database operations
- **WebSocket** – Real-time event streaming
- **Alembic** – Database migrations
- **Automatic API Docs** – Interactive Swagger UI at `/docs`

## Tech Stack

- **Framework:** FastAPI 0.104+
- **Language:** Python 3.11+
- **Server:** Uvicorn (ASGI)
- **Database:** PostgreSQL 14+
- **ORM:** SQLAlchemy 2.0+
- **Migrations:** Alembic
- **Real-time:** WebSockets

## Setup

### Prerequisites

- Python 3.11+ (download from [python.org](https://www.python.org))
- PostgreSQL 14+ (or Supabase account)
- pip (comes with Python)

### Installation

#### Option 1: Using Docker Compose (Recommended)

```bash
cd ..  # Go to project root
docker-compose up -d

# Wait for services to start
docker-compose logs -f backend

# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

#### Option 2: Manual Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/workflow_factory

# Run database migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000/docs` to see interactive API documentation.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration from env
│   │
│   ├── api/                 # API endpoints
│   │   ├── workflows.py
│   │   ├── agents.py
│   │   ├── tasks.py
│   │   ├── suggestions.py
│   │   ├── health.py
│   │   └── deps.py          # Dependency injection
│   │
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── workflow.py
│   │   ├── agent.py
│   │   ├── task.py
│   │   ├── suggestion.py
│   │   ├── audit_log.py
│   │   └── base.py
│   │
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── workflow.py
│   │   ├── agent.py
│   │   ├── task.py
│   │   ├── suggestion.py
│   │   └── common.py
│   │
│   ├── services/            # Business logic
│   │   ├── workflow_service.py
│   │   ├── agent_service.py
│   │   ├── task_service.py
│   │   ├── suggestion_service.py
│   │   └── audit_service.py
│   │
│   ├── websockets/          # Real-time events
│   │   ├── manager.py
│   │   ├── events.py
│   │   └── handlers.py
│   │
│   └── db/                  # Database configuration
│       ├── base.py
│       ├── session.py
│       └── engine.py
│
├── migrations/              # Alembic database migrations
│   └── versions/
│
├── tests/                   # Test suite
│   ├── test_workflows.py
│   ├── test_agents.py
│   ├── test_tasks.py
│   └── conftest.py
│
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
├── Dockerfile              # Docker image
└── alembic.ini             # Alembic configuration
```

## Environment Variables

Create `.env`:

```env
# Environment
ENV=development
DEBUG=true

# Database
DATABASE_URL=postgresql://workflow_user:workflow_password@localhost:5432/workflow_factory

# Security
SECRET_KEY=dev-secret-key-change-in-production

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API
API_HOST=0.0.0.0
API_PORT=8000

# Logging
LOG_LEVEL=INFO
```

## Running the Server

### Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The `--reload` flag watches for file changes and auto-restarts.

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Database

### Create Tables

```bash
# Run pending migrations
alembic upgrade head
```

### Create a Migration

```bash
# After changing models
alembic revision --autogenerate -m "Add new column"
alembic upgrade head
```

### Reset Database

```bash
# ⚠️ Warning: This deletes all data!
alembic downgrade base
alembic upgrade head
```

### View Database

Using Adminer (if running with Docker Compose):

```
http://localhost:8080
```

Login with:
- Server: `postgres`
- Username: `workflow_user`
- Password: `workflow_password`
- Database: `workflow_factory`

## API Documentation

### Interactive Swagger UI

```
http://localhost:8000/docs
```

### Interactive ReDoc

```
http://localhost:8000/redoc
```

### OpenAPI JSON

```
http://localhost:8000/openapi.json
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest

# Run specific test file
pytest tests/test_workflows.py

# Run with coverage
pytest --cov=app --cov-report=html

# Watch mode (requires pytest-watch)
ptw
```

### Writing Tests

```python
# tests/test_workflows.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_list_workflows():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/workflows")
        assert response.status_code == 200
        assert "items" in response.json()
```

## Creating Endpoints

### 1. Define Schema (Pydantic)

```python
# app/schemas/workflow.py
from pydantic import BaseModel
from typing import Optional

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None

class WorkflowResponse(BaseModel):
    id: str
    name: str
    status: str
    progress: int
```

### 2. Define Model (SQLAlchemy)

```python
# app/models/workflow.py
from sqlalchemy import Column, String, Integer
from app.db.base import Base

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")
    progress = Column(Integer, default=0)
```

### 3. Create Service (Business Logic)

```python
# app/services/workflow_service.py
class WorkflowService:
    async def create_workflow(self, workflow_data: WorkflowCreate):
        workflow = Workflow(**workflow_data.dict())
        session.add(workflow)
        await session.commit()
        return workflow
```

### 4. Add Route (Endpoint)

```python
# app/api/workflows.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/", response_model=WorkflowResponse)
async def create_workflow(workflow: WorkflowCreate):
    service = WorkflowService()
    return await service.create_workflow(workflow)
```

## WebSocket Events

### Broadcasting from Service

```python
from app.websockets.manager import manager

async def update_workflow_status(workflow_id: str, status: str):
    # ... update database ...
    
    # Broadcast to clients
    await manager.broadcast({
        "type": "workflow_update",
        "data": {
            "id": workflow_id,
            "status": status,
        }
    }, channel="workflows")
```

### Client Subscription

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.send(JSON.stringify({
  action: 'subscribe',
  channel: 'workflows'
}));

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Update:', update);
};
```

## Logging

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Workflow created: %s", workflow_id)
logger.error("Database error: %s", str(e))
```

## Performance Tips

1. **Use async/await** – All I/O operations should be async
2. **Database indexes** – Add indexes to frequently queried columns
3. **Connection pooling** – SQLAlchemy handles this automatically
4. **Pagination** – Always paginate list endpoints
5. **Caching** – Cache frequently accessed data with Redis (future)

## Security Best Practices

- ✅ Use environment variables for secrets
- ✅ Validate all inputs (Pydantic does this)
- ✅ Use ORM to prevent SQL injection
- ✅ Hash passwords (implement in auth phase)
- ✅ Use HTTPS in production
- ✅ Add CORS restrictions
- ✅ Rate limiting (implement in phase 2)
- ✅ Log all important actions

## Debugging

### Enable Debug Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Database Queries

```python
# Enable SQLAlchemy echo (logs all SQL)
# In app/db/session.py:
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True  # Set to True to see queries
)
```

### Python Debugger

```python
import pdb; pdb.set_trace()  # Breakpoint
# Or use: breakpoint() in Python 3.7+
```

## Deployment

### Docker

```bash
# Build image
docker build -t wfd-backend .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  wfd-backend
```

### Heroku

```bash
heroku create wfd-api
heroku addons:create heroku-postgresql
git push heroku main
```

### Railway/Render

Push to GitHub, connect to Railway/Render, set environment variables.

## Troubleshooting

### "asyncpg" not found

```bash
pip install asyncpg
```

### Database connection error

Check your `DATABASE_URL`:

```
postgresql://user:password@host:port/database
```

### Port 8000 already in use

```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn app.main:app --port 8001
```

### Migration conflict

```bash
alembic current  # See current version
alembic stamp head  # Reset to latest
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Further Reading

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Async](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [Pydantic Docs](https://docs.pydantic.dev)
- [WebSocket Intro](https://fastapi.tiangolo.com/advanced/websockets/)

---

**Happy coding! 🚀**
