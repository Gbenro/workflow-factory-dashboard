# Architecture Overview

A comprehensive guide to the Workflow Factory Dashboard system design and component interaction.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Next.js Frontend (React)                │  │
│  │  - Dashboard                                     │  │
│  │  - Task Board (Kanban)                          │  │
│  │  - Collaboration Pane                           │  │
│  │  - Agent Management                             │  │
│  └──────────────┬───────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────┘
                  │ HTTP + WebSocket
                  ▼
┌─────────────────────────────────────────────────────────┐
│         API Gateway / Load Balancer (Nginx)             │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐     ┌──────────────┐
│  REST API    │     │   WebSocket  │
│  (FastAPI)   │     │  (FastAPI)   │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                ▼
       ┌────────────────────┐
       │  FastAPI Backend   │
       │  ┌────────────────┐│
       │  │ API Routers:   ││
       │  │ - workflows    ││
       │  │ - agents       ││
       │  │ - tasks        ││
       │  │ - suggestions  ││
       │  └────────────────┘│
       │  ┌────────────────┐│
       │  │ Services:      ││
       │  │ - Business     ││
       │  │   Logic        ││
       │  └────────────────┘│
       │  ┌────────────────┐│
       │  │ WebSocket      ││
       │  │ Manager        ││
       │  └────────────────┘│
       └────────┬───────────┘
                │
                ▼
       ┌────────────────────┐
       │   SQLAlchemy ORM   │
       │  (Database Models) │
       └────────┬───────────┘
                │
                ▼
       ┌────────────────────┐
       │  PostgreSQL DB     │
       │  ┌────────────────┐│
       │  │ Tables:        ││
       │  │ - workflows    ││
       │  │ - agents       ││
       │  │ - tasks        ││
       │  │ - suggestions  ││
       │  │ - audit_logs   ││
       │  └────────────────┘│
       └────────────────────┘
```

## Frontend Architecture

### Layer Structure

```
Frontend (Next.js 14)
├── Pages/Routes (app/ directory)
│   ├── /dashboard       → Dashboard page
│   ├── /workflows       → Workflow management
│   ├── /tasks           → Task board (Kanban)
│   └── /agents          → Agent registry
│
├── Components (React)
│   ├── /dashboard       → Dashboard widgets
│   │   ├── WorkflowStatus.tsx
│   │   ├── AgentMetrics.tsx
│   │   └── SystemHealth.tsx
│   │
│   ├── /taskboard       → Kanban board
│   │   ├── TaskBoard.tsx
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   └── DragDropProvider.tsx
│   │
│   ├── /collaboration   → Collaboration features
│   │   ├── CollaborationPane.tsx
│   │   ├── SuggestionCard.tsx
│   │   ├── CommentThread.tsx
│   │   └── ApprovalForm.tsx
│   │
│   └── /shared          → Shared components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Modal.tsx
│       ├── Spinner.tsx
│       └── Button.tsx
│
├── Hooks (Custom React Hooks)
│   ├── useWebSocket.ts          → WebSocket connection
│   ├── useWorkflows.ts          → Workflow data fetching
│   ├── useTasks.ts              → Task management
│   ├── useAgents.ts             → Agent status
│   ├── useSuggestions.ts        → Suggestion handling
│   └── useRealtimeUpdates.ts    → Real-time data sync
│
├── Utilities (lib/)
│   ├── api.ts           → API client (fetch wrapper)
│   ├── websocket.ts     → WebSocket client logic
│   ├── hooks.ts         → Shared hook utilities
│   └── constants.ts     → App-wide constants
│
├── Types (TypeScript)
│   ├── workflow.ts
│   ├── agent.ts
│   ├── task.ts
│   ├── suggestion.ts
│   └── api.ts
│
└── Styles
    ├── globals.css      → Global Tailwind + CSS
    └── components/      → Component-scoped CSS
```

### Data Flow (Frontend)

```
User Interaction → Component State → Custom Hook → API Call/WebSocket
                                          ↓
                                    Backend Service
                                          ↓
                                    Response/WebSocket Event
                                          ↓
                                    Update Component State
                                          ↓
                                    Re-render UI
```

### Example: Real-time Task Update

1. **WebSocket Event Received**
   ```typescript
   // lib/useRealtimeUpdates.ts
   ws.onmessage = (event) => {
     const update = JSON.parse(event.data);
     if (update.type === 'task_update') {
       // Update React state
       setTasks(prev => 
         prev.map(t => t.id === update.data.id ? update.data : t)
       );
     }
   };
   ```

2. **Component Re-renders**
   ```typescript
   // components/taskboard/TaskCard.tsx
   const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
     return (
       <div className="bg-white rounded shadow p-4">
         <h3>{task.name}</h3>
         <p>{task.status}</p>  {/* Reflects latest status */}
       </div>
     );
   };
   ```

3. **User Sees Update**
   - Task card background changes from yellow (in-progress) to green (completed)
   - Animation smooth (~500ms)

## Backend Architecture

### Layer Structure

```
Backend (FastAPI)
├── main.py                 → App entry point, ASGI config
│
├── api/                    → API Endpoints (routers)
│   ├── __init__.py
│   ├── workflows.py        → GET/POST/PUT workflows
│   ├── agents.py           → GET agents, agent status
│   ├── tasks.py            → GET/POST tasks, task status
│   ├── suggestions.py      → Suggestions (CRUD + approve/reject)
│   ├── health.py           → Health check endpoint
│   └── deps.py             → Dependency injection
│
├── schemas/                → Pydantic Data Models (Request/Response)
│   ├── workflow.py
│   ├── agent.py
│   ├── task.py
│   ├── suggestion.py
│   └── common.py           → Shared schemas
│
├── models/                 → SQLAlchemy Database Models
│   ├── workflow.py         → ORM: Workflow table
│   ├── agent.py            → ORM: Agent table
│   ├── task.py             → ORM: Task table
│   ├── suggestion.py       → ORM: Suggestion table
│   ├── comment.py          → ORM: Comment table
│   ├── audit_log.py        → ORM: Audit log table
│   └── base.py             → Base model class
│
├── services/               → Business Logic
│   ├── workflow_service.py → Workflow operations
│   ├── agent_service.py    → Agent management
│   ├── task_service.py     → Task operations
│   ├── suggestion_service.py→ Suggestion handling
│   └── audit_service.py    → Audit log tracking
│
├── websockets/             → Real-time Communication
│   ├── __init__.py
│   ├── manager.py          → WebSocket connection manager
│   ├── events.py           → Event definitions
│   └── handlers.py         → Event handlers
│
├── db/                     → Database Configuration
│   ├── base.py             → Base model for ORM
│   ├── session.py          → SQLAlchemy session factory
│   ├── engine.py           → Database engine setup
│   └── migrations/         → Alembic migrations
│
├── config.py               → App configuration (env vars)
├── requirements.txt        → Python dependencies
└── Dockerfile              → Docker image definition
```

### Request Flow (Backend)

```
Client HTTP Request
    ↓
Route: /api/workflows
    ↓
Router (workflows.py)
    ├─ Dependency Injection (deps.py)
    │  ├─ Get DB session
    │  └─ Validate auth (future)
    ↓
Handler Function
    ├─ Validate request schema (Pydantic)
    ├─ Call service layer
    ├─ Handle errors/exceptions
    └─ Return response (schema)
    ↓
Database (if needed)
    ├─ Query via ORM (SQLAlchemy)
    ├─ Update models
    └─ Persist changes
    ↓
Service Layer (services/)
    ├─ Business logic
    ├─ Data transformation
    └─ Return result
    ↓
Broadcast Event (if real-time)
    ├─ WebSocket manager notifies connected clients
    └─ Clients receive update
    ↓
HTTP Response (200/201/400/etc)
```

### Example: Create Task Endpoint

```python
# api/tasks.py
from fastapi import APIRouter, Depends
from schemas.task import TaskCreate, TaskResponse
from services.task_service import TaskService
from websockets.manager import ws_manager

router = APIRouter()

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    service: TaskService = Depends()
) -> TaskResponse:
    # 1. Service creates task
    new_task = await service.create_task(task_data)
    
    # 2. Broadcast to WebSocket clients
    await ws_manager.broadcast({
        "type": "task_created",
        "data": new_task.dict()
    })
    
    # 3. Return response
    return TaskResponse.from_orm(new_task)
```

## Database Schema

### Core Tables

```sql
-- Workflows
CREATE TABLE workflows (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),  -- running, completed, failed
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36)
);

-- Agents
CREATE TABLE agents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50),  -- online, offline, busy
  capabilities JSONB,  -- Array of capabilities
  success_rate FLOAT DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  failed_tasks INTEGER DEFAULT 0,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  workflow_id VARCHAR(36) REFERENCES workflows(id),
  agent_id VARCHAR(36) REFERENCES agents(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),  -- pending, in_progress, completed, failed
  priority VARCHAR(50),  -- high, medium, low
  due_date TIMESTAMP,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suggestions
CREATE TABLE suggestions (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) REFERENCES tasks(id),
  agent_id VARCHAR(36) REFERENCES agents(id),
  action VARCHAR(255),
  reasoning TEXT,
  status VARCHAR(50),  -- pending, approved, rejected
  confidence FLOAT,
  approved_at TIMESTAMP,
  approved_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments (for collaboration)
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) REFERENCES tasks(id),
  author_id VARCHAR(36),
  author_type VARCHAR(50),  -- human, agent
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log (compliance)
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  entity_type VARCHAR(50),  -- workflow, task, suggestion
  entity_id VARCHAR(36),
  action VARCHAR(50),  -- created, updated, deleted
  actor_id VARCHAR(36),
  actor_type VARCHAR(50),  -- human, agent, system
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance

```sql
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at);
CREATE INDEX idx_tasks_workflow_id ON tasks(workflow_id);
CREATE INDEX idx_tasks_agent_id ON tasks(agent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_suggestions_task_id ON suggestions(task_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_agents_status ON agents(status);
```

## WebSocket Architecture

### Connection Flow

```
Client connects
    ↓
ws_manager.connect(client)
    ├─ Add to active connections
    └─ Send "connected" message
    ↓
Client sends subscription
    ├─ {"action": "subscribe", "channel": "workflows"}
    └─ ws_manager adds to channel subscribers
    ↓
Event occurs (task created, agent updated, etc)
    ↓
Service broadcasts event
    ├─ ws_manager.broadcast(event, channel="tasks")
    ├─ Sends to all subscribers
    └─ Client receives via ws.onmessage
    ↓
Client disconnects
    ├─ ws_manager.disconnect(client)
    └─ Remove from connections & all subscriptions
```

### Event Types

```
From Server:
├─ workflow_update   → Workflow status changed
├─ task_update       → Task status/progress changed
├─ agent_status      → Agent online/offline/busy
├─ suggestion_created→ New suggestion from agent
├─ suggestion_approved→ Human approved suggestion
└─ comment_added     → New comment on task

From Client:
├─ subscribe         → Subscribe to channel
├─ unsubscribe       → Unsubscribe from channel
└─ ping              → Keep-alive heartbeat
```

## Deployment Architecture

### Production Setup

```
Internet
    ↓
┌─────────────────────┐
│   Nginx (Reverse    │
│   Proxy + SSL)      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌─────────┐ ┌─────────┐
│ FastAPI │ │ FastAPI │  (Scaled horizontally)
│ Backend │ │ Backend │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ▼
    ┌─────────────┐
    │ PostgreSQL  │  (Managed service or self-hosted)
    │ Database    │
    └─────────────┘
    
Next.js Frontend deployed to:
├─ Vercel (Recommended)
├─ Netlify
└─ Your own servers
```

## Scaling Considerations

### Horizontal Scaling

**Backend (FastAPI):**
- Run multiple instances behind load balancer
- Use Redis for session/cache if needed
- Database connection pooling

**Frontend (Next.js):**
- Static generation for performance
- CDN for asset distribution
- Vercel auto-scaling (recommended)

### WebSocket Scaling

- For multiple backend instances, use Redis Pub/Sub
- Each instance subscribes to same channels
- Events broadcast through Redis

```python
# Future: Multi-instance WebSocket support
from redis import Redis

redis_client = Redis(host='localhost', port=6379)

# When event occurs
redis_client.publish('tasks', json.dumps(event))

# All instances listen and broadcast to their clients
pubsub = redis_client.pubsub()
pubsub.subscribe('tasks')
```

## Security Considerations

### Current (Development)

- No authentication
- No CORS restrictions
- Debug mode enabled

### Production Checklist

- [ ] Implement JWT authentication
- [ ] HTTPS/TLS encryption
- [ ] CORS configured for specific origins
- [ ] API rate limiting
- [ ] Input validation (Pydantic)
- [ ] SQL injection prevention (ORM)
- [ ] CSRF protection
- [ ] Dependency security scanning
- [ ] Audit logging
- [ ] Database encryption
- [ ] Environment variable management

## Performance Optimization

### Frontend

- Code splitting (Next.js automatic)
- Image optimization
- Lazy loading components
- Debounce WebSocket updates
- Cache API responses

### Backend

- Database query optimization (use indexes)
- Connection pooling
- Pagination for large lists
- Async/await for I/O operations
- Response compression
- Caching frequently accessed data

### Database

- Proper indexing
- Query analysis and optimization
- Vacuum and analyze regularly
- Partitioning for large tables (future)

## Monitoring & Observability

### Metrics to Track

- API response times
- WebSocket connection count
- Database query performance
- CPU/memory usage
- Error rates
- Task completion rates
- Agent success rates

### Logging

- All API requests/responses
- Database operations
- WebSocket events
- Errors and exceptions
- Audit trail

### Tools (Future)

- Prometheus for metrics
- ELK stack for logging
- Datadog for monitoring
- Sentry for error tracking

---

**Last Updated:** February 2026  
**Status:** Architecture Review Pending
