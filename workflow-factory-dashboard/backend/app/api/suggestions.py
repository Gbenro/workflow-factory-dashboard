"""Suggestion endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_suggestions(skip: int = 0, limit: int = 50, status: str = None):
    """List all suggestions."""
    return {
        "total": 3,
        "items": [
            {
                "id": "sugg-001",
                "task_id": "task-002",
                "agent_id": "agent-002-er",
                "action": "send_response_email",
                "reasoning": "Email response is drafted and ready. High confidence.",
                "status": "pending",
                "confidence": 0.95,
                "created_at": "2026-02-09T19:18:30Z",
            },
            {
                "id": "sugg-002",
                "task_id": "task-003",
                "agent_id": "agent-003-em",
                "action": "close_ticket_with_solution",
                "reasoning": "No escalation needed. Issue is straightforward.",
                "status": "pending",
                "confidence": 0.99,
                "created_at": "2026-02-09T19:19:00Z",
            },
            {
                "id": "sugg-100",
                "task_id": "task-100",
                "agent_id": "agent-004-dc",
                "action": "proceed_with_migration",
                "reasoning": "Data validation passed. Ready for next stage.",
                "status": "approved",
                "confidence": 0.98,
                "approved_at": "2026-02-08T12:35:00Z",
                "approved_by": "human-001",
                "created_at": "2026-02-08T12:30:00Z",
            },
        ],
        "skip": skip,
        "limit": limit,
    }


@router.get("/{suggestion_id}")
async def get_suggestion(suggestion_id: str):
    """Get suggestion details."""
    return {
        "id": suggestion_id,
        "task_id": "task-002",
        "agent_id": "agent-002-er",
        "action": "send_response_email",
        "reasoning": "Email response is ready.",
        "status": "pending",
        "confidence": 0.95,
    }


@router.post("/")
async def create_suggestion(
    task_id: str,
    agent_id: str,
    action: str,
    reasoning: str,
    confidence: float = 0.5,
):
    """Create a new suggestion."""
    return {
        "id": "sugg-new-123",
        "task_id": task_id,
        "agent_id": agent_id,
        "action": action,
        "reasoning": reasoning,
        "confidence": confidence,
        "status": "pending",
        "created_at": "2026-02-09T19:20:00Z",
    }


@router.post("/{suggestion_id}/approve")
async def approve_suggestion(suggestion_id: str, approved_by: str = None):
    """Approve a suggestion."""
    return {
        "id": suggestion_id,
        "status": "approved",
        "approved_by": approved_by,
        "approved_at": "2026-02-09T19:20:00Z",
    }


@router.post("/{suggestion_id}/reject")
async def reject_suggestion(suggestion_id: str, rejected_by: str = None, reason: str = None):
    """Reject a suggestion."""
    return {
        "id": suggestion_id,
        "status": "rejected",
        "rejected_by": rejected_by,
        "reason": reason,
        "rejected_at": "2026-02-09T19:20:00Z",
    }
