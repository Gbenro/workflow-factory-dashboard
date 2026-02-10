# Contributing to Workflow Factory Dashboard

Thank you for your interest in contributing! This document explains how to work with us, whether you're a human developer, AI agent, or hybrid team.

## Our Philosophy

Workflow Factory Dashboard is designed to enable **humans + AI agents to collaborate on software**. We practice what we preach:

- **Code reviews work better with agent suggestions** – agents spot patterns, humans verify intent
- **Discussions benefit from diverse perspectives** – your feedback (human or AI) matters
- **Testing is collaborative** – agents write tests, humans validate coverage
- **Documentation improves with both perspectives** – agents provide accuracy, humans provide clarity

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+ and pip
- PostgreSQL 14+ (or Supabase account)
- Docker (optional, recommended)
- Git

### Development Environment Setup

```bash
# Clone the repo
git clone https://github.com/Gbenro/workflow-factory-dashboard
cd workflow-factory-dashboard

# For quick setup with Docker:
docker-compose up -d

# Or manual setup:
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="postgresql://user:pass@localhost:5432/workflow_factory"
alembic upgrade head
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Project Structure Quick Reference

```
frontend/          → Next.js 14 React app (TypeScript)
  ├── app/        → Page routes & layouts
  ├── components/ → Reusable UI components
  ├── lib/        → Hooks, utilities, WebSocket client
  └── types/      → TypeScript interfaces

backend/           → FastAPI Python app
  ├── app/api/    → REST endpoints
  ├── app/models/ → Database models (SQLAlchemy)
  ├── app/schemas/→ Request/response schemas (Pydantic)
  ├── app/services/→ Business logic
  └── migrations/ → Alembic database migrations
```

## How We Collaborate

### 1. For Humans + AI Teams

**When opening an issue:**
- If an AI agent will work on it, use the `ai-ready` label
- Include acceptance criteria (easier for agents)
- Link related workflows/agents if applicable

**When reviewing code:**
- Check agent-generated code for:
  - Logic correctness (agents excel at patterns, humans catch edge cases)
  - Test coverage (agents write tests, humans validate coverage gaps)
  - Documentation (agents are thorough; humans ensure clarity)
  - API contracts (important for real-time system)

**Suggestion Workflow:**
- Agent submits PR → human reviews → human requests changes → agent refines
- Human codes → agent suggests improvements → human accepts/rejects
- Both can contribute tests simultaneously

### 2. Code Standards

#### TypeScript (Frontend)

```typescript
// Use strict typing - no `any` without justification
const Component: React.FC<Props> = ({ prop }) => {
  // Props must be typed
  // Return JSX or null
};

// Style: 2-space indent, semicolons required
const result = complexFunction(arg1, arg2);
```

**Checklist:**
- ✅ No `any` types (use unknown if needed, then narrow)
- ✅ Props and returns are typed
- ✅ Components are named exports (easier for testing)
- ✅ Use Tailwind for styling (no CSS files except globals)

#### Python (Backend)

```python
# Type hints on all functions
from typing import Optional, List
from fastapi import APIRouter

def process_workflow(workflow_id: str) -> dict:
    """Clear docstrings."""
    pass

# Use async for I/O operations
async def fetch_from_db() -> List[Model]:
    pass
```

**Checklist:**
- ✅ Type hints on function parameters and returns
- ✅ Docstrings for all public functions
- ✅ Async/await for database and API calls
- ✅ Pydantic schemas for request/response validation
- ✅ SQLAlchemy models for database operations

#### Database (PostgreSQL)

```python
# Alembic migrations for schema changes
# Never modify tables directly - always use migrations

# In backend/migrations/versions/
def upgrade():
    op.create_table(
        'workflows',
        sa.Column('id', sa.String(36), primary_key=True),
        # ...
    )

def downgrade():
    op.drop_table('workflows')
```

**Checklist:**
- ✅ Create migration files for schema changes
- ✅ Test both upgrade and downgrade
- ✅ Keep migrations small and focused

### 3. Testing Standards

#### Frontend Testing (Jest + React Testing Library)

```typescript
// tests/components/TaskBoard.test.tsx
import { render, screen } from '@testing-library/react';
import TaskBoard from '@/components/taskboard/TaskBoard';

describe('TaskBoard', () => {
  it('renders tasks', () => {
    render(<TaskBoard tasks={mockTasks} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });
});
```

**Requirements:**
- ✅ Unit tests for all components and hooks
- ✅ Integration tests for critical workflows
- ✅ Minimum 70% coverage (aim for 85%+)
- ✅ Mock WebSocket for real-time tests

#### Backend Testing (Pytest)

```python
# tests/test_workflows.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_workflow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/workflows", json={
            "name": "Test Workflow"
        })
        assert response.status_code == 201
```

**Requirements:**
- ✅ Unit tests for models, schemas, services
- ✅ Integration tests for API endpoints
- ✅ WebSocket tests for real-time features
- ✅ Minimum 70% coverage (aim for 85%+)

### 4. Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or: fix/bug-description
   # or: docs/documentation-update
   ```

2. **Make commits with clear messages:**
   ```
   feat: add real-time agent status updates
   
   - Implement WebSocket handler for agent events
   - Add client-side subscription logic
   - Update dashboard to show live status
   
   Fixes #123
   ```

3. **Push and open a PR with description:**
   ```markdown
   ## Description
   Adds real-time agent status tracking to the dashboard.
   
   ## Changes
   - Backend: WebSocket endpoint for agent events
   - Frontend: Real-time status component
   - Docs: Updated API docs
   
   ## Testing
   - Manual: Tested with mock agent
   - Automated: 5 new tests added
   
   ## Checklist
   - [x] Tests pass locally
   - [x] Code follows style guidelines
   - [x] Documentation updated
   - [x] No breaking changes
   ```

4. **Wait for review:**
   - At least 1 approval required
   - CI/CD checks must pass
   - Address feedback

5. **Merge after approval:**
   - Squash commits if multiple (cleaner history)
   - Delete branch after merge

### 5. Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation
- `style:` – Code style (formatting, missing semicolons)
- `refactor:` – Code refactoring
- `perf:` – Performance improvement
- `test:` – Test additions/changes
- `chore:` – Build, deps, tooling

**Examples:**
```
feat(dashboard): add real-time workflow status
fix(taskboard): resolve drag-drop z-index issue
docs(api): update WebSocket event documentation
refactor(backend): optimize database queries
```

## Code Review Checklist

Whether you're a human or AI reviewer, check these items:

- [ ] **Code Quality:** Does it follow our style guide?
- [ ] **Tests:** Are tests comprehensive and passing?
- [ ] **Performance:** Any obvious inefficiencies?
- [ ] **Security:** No SQL injection, XSS, auth issues?
- [ ] **Types:** Full TypeScript/Python typing?
- [ ] **Documentation:** Functions/components documented?
- [ ] **Backwards Compatibility:** Any breaking changes?
- [ ] **Database:** Migrations present if schema changed?

## File Naming Conventions

```
Frontend:
  components/     → PascalCase.tsx (React components)
  lib/            → camelCase.ts (utilities, hooks)
  types/          → camelCase.ts (TypeScript types)
  app/            → kebab-case/ (routes)

Backend:
  app/api/        → snake_case.py (endpoint files)
  app/models/     → snake_case.py (database models)
  app/schemas/    → snake_case.py (Pydantic schemas)
  tests/          → test_snake_case.py
```

## Documentation Standards

- **README:** Project-level overview and quick start
- **CONTRIBUTING.md:** Development guidelines (this file)
- **docs/API.md:** Complete API documentation
- **docs/ARCHITECTURE.md:** System design and decisions
- **Code comments:** Explain "why", not "what"
- **Docstrings:** All public functions must have them
- **Changelog:** Update with significant changes

Example docstring (Python):
```python
async def create_workflow(workflow: WorkflowCreate) -> Workflow:
    """
    Create a new workflow.
    
    Args:
        workflow: Workflow creation data
        
    Returns:
        Created workflow with ID
        
    Raises:
        ValueError: If workflow name is invalid
    """
```

## Performance Considerations

- **Frontend:** Keep WebSocket connections alive, debounce updates
- **Backend:** Use async/await, optimize database queries, cache where appropriate
- **Database:** Index frequently queried columns, use migrations for schema changes
- **API:** Return only necessary fields, implement pagination for lists

## Security Checklist

- [ ] No hardcoded secrets (use .env files)
- [ ] SQL queries use ORM (prevent injection)
- [ ] API validates all inputs (Pydantic/TypeScript)
- [ ] Authentication/authorization implemented
- [ ] WebSocket validates connections
- [ ] CORS properly configured
- [ ] Dependencies scanned for vulnerabilities (regularly)

## Questions or Need Help?

- 📖 Check [docs/](docs/) for architecture and API details
- 💬 Open a [discussion](https://github.com/Gbenro/workflow-factory-dashboard/discussions)
- 🐛 [Report issues](https://github.com/Gbenro/workflow-factory-dashboard/issues)
- 🤝 Ask in code review comments

## Thank You!

Every contribution – code, docs, issues, discussions, ideas – makes this better. We're building the future of human + AI collaboration, one feature at a time. ❤️
