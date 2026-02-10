"""Agent endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_agents(skip: int = 0, limit: int = 50):
    """List all agents."""
    return {
        "total": 5,
        "items": [
            {
                "id": "agent-001-ta",
                "name": "TicketAnalyzer",
                "status": "online",
                "success_rate": 0.98,
                "total_tasks": 1247,
                "failed_tasks": 25,
                "last_seen": "2026-02-09T19:20:00Z",
            },
            {
                "id": "agent-002-er",
                "name": "EmailResponder",
                "status": "online",
                "success_rate": 0.96,
                "total_tasks": 856,
                "failed_tasks": 34,
                "last_seen": "2026-02-09T19:19:00Z",
            },
            {
                "id": "agent-003-em",
                "name": "EscalationManager",
                "status": "online",
                "success_rate": 0.99,
                "total_tasks": 1247,
                "failed_tasks": 12,
                "last_seen": "2026-02-09T19:18:00Z",
            },
            {
                "id": "agent-004-dc",
                "name": "DataConverter",
                "status": "offline",
                "success_rate": 0.94,
                "total_tasks": 543,
                "failed_tasks": 33,
                "last_seen": "2026-02-09T18:00:00Z",
            },
            {
                "id": "agent-005-qc",
                "name": "QualityChecker",
                "status": "busy",
                "success_rate": 0.97,
                "total_tasks": 892,
                "failed_tasks": 27,
                "last_seen": "2026-02-09T19:15:00Z",
            },
        ],
        "skip": skip,
        "limit": limit,
    }


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details."""
    return {
        "id": agent_id,
        "name": "TicketAnalyzer",
        "status": "online",
        "success_rate": 0.98,
        "total_tasks": 1247,
        "failed_tasks": 25,
        "last_seen": "2026-02-09T19:20:00Z",
    }
