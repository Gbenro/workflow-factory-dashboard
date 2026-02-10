"""Task endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_tasks(skip: int = 0, limit: int = 50, status: str = None):
    """List all tasks."""
    return {
        "total": 5,
        "items": [
            {
                "id": "task-001",
                "name": "Analyze Support Ticket",
                "workflow_id": "wf-001",
                "agent_id": "agent-001-ta",
                "status": "in_progress",
                "priority": "high",
                "progress": 75,
                "created_at": "2026-02-09T19:15:00Z",
                "started_at": "2026-02-09T19:16:00Z",
            },
            {
                "id": "task-002",
                "name": "Draft Response Email",
                "workflow_id": "wf-001",
                "agent_id": "agent-002-er",
                "status": "pending",
                "priority": "high",
                "progress": 0,
                "created_at": "2026-02-09T19:16:00Z",
            },
            {
                "id": "task-003",
                "name": "Evaluate Escalation Need",
                "workflow_id": "wf-001",
                "agent_id": "agent-003-em",
                "status": "pending",
                "priority": "high",
                "progress": 0,
                "created_at": "2026-02-09T19:16:00Z",
            },
            {
                "id": "task-100",
                "name": "Validate Customer Data",
                "workflow_id": "wf-002",
                "agent_id": "agent-004-dc",
                "status": "completed",
                "priority": "high",
                "progress": 100,
                "created_at": "2026-02-08T10:00:00Z",
                "completed_at": "2026-02-08T12:30:00Z",
            },
            {
                "id": "task-200",
                "name": "Quality Check: Articles",
                "workflow_id": "wf-003",
                "agent_id": "agent-005-qc",
                "status": "in_progress",
                "priority": "medium",
                "progress": 30,
                "created_at": "2026-02-09T18:00:00Z",
            },
        ],
        "skip": skip,
        "limit": limit,
    }


@router.get("/{task_id}")
async def get_task(task_id: str):
    """Get task details."""
    return {
        "id": task_id,
        "name": "Analyze Support Ticket",
        "workflow_id": "wf-001",
        "agent_id": "agent-001-ta",
        "status": "in_progress",
        "priority": "high",
        "progress": 75,
    }


@router.post("/")
async def create_task(name: str, workflow_id: str, agent_id: str = None):
    """Create a new task."""
    return {
        "id": "task-new-123",
        "name": name,
        "workflow_id": workflow_id,
        "agent_id": agent_id,
        "status": "pending",
        "progress": 0,
        "created_at": "2026-02-09T19:20:00Z",
    }


@router.put("/{task_id}")
async def update_task(task_id: str, status: str = None, progress: int = None):
    """Update task."""
    return {
        "id": task_id,
        "status": status,
        "progress": progress,
    }
