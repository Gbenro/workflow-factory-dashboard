# Mock Data & Example Workflows

This document provides sample data for testing and demonstration purposes.

## Sample Workflow: Customer Support Automation

### Workflow Definition

```json
{
  "id": "wf-001-csa",
  "name": "Customer Support Automation",
  "description": "Automated ticket analysis, categorization, and response drafting",
  "status": "running",
  "progress": 65,
  "created_at": "2026-02-09T09:00:00Z",
  "updated_at": "2026-02-09T19:20:00Z",
  "agent_ids": ["agent-001-ta", "agent-002-er", "agent-003-em"],
  "trigger": {
    "type": "event",
    "source": "email",
    "condition": "new_support_ticket"
  }
}
```

### Agents in This Workflow

#### 1. TicketAnalyzer (agent-001-ta)

```json
{
  "id": "agent-001-ta",
  "name": "TicketAnalyzer",
  "description": "Analyzes support tickets and extracts key information",
  "status": "online",
  "capabilities": [
    "parse_email",
    "extract_entities",
    "classify_issue",
    "prioritize",
    "detect_urgency"
  ],
  "success_rate": 0.98,
  "total_tasks": 1247,
  "failed_tasks": 25,
  "last_seen": "2026-02-09T19:20:00Z",
  "current_task_id": "task-001",
  "metrics": {
    "avg_task_duration_seconds": 45,
    "issues_resolved": 1222,
    "accuracy": 0.98
  }
}
```

#### 2. EmailResponder (agent-002-er)

```json
{
  "id": "agent-002-er",
  "name": "EmailResponder",
  "description": "Drafts professional email responses to support tickets",
  "status": "online",
  "capabilities": [
    "draft_response",
    "verify_accuracy",
    "apply_tone",
    "check_spelling",
    "generate_templates"
  ],
  "success_rate": 0.96,
  "total_tasks": 856,
  "failed_tasks": 34,
  "last_seen": "2026-02-09T19:19:00Z",
  "current_task_id": "task-002",
  "metrics": {
    "avg_task_duration_seconds": 90,
    "emails_drafted": 822,
    "approval_rate": 0.94
  }
}
```

#### 3. EscalationManager (agent-003-em)

```json
{
  "id": "agent-003-em",
  "name": "EscalationManager",
  "description": "Determines if tickets need human escalation",
  "status": "online",
  "capabilities": [
    "detect_complexity",
    "identify_vip_customers",
    "assess_urgency",
    "route_to_specialist",
    "create_escalation_ticket"
  ],
  "success_rate": 0.99,
  "total_tasks": 1247,
  "failed_tasks": 12,
  "last_seen": "2026-02-09T19:18:00Z",
  "current_task_id": null,
  "metrics": {
    "escalations_triggered": 89,
    "false_escalations": 3,
    "accuracy": 0.99
  }
}
```

### Task Sequence

#### Task 1: Analyze Support Ticket

```json
{
  "id": "task-001",
  "workflow_id": "wf-001-csa",
  "name": "Analyze Support Ticket",
  "description": "Parse and analyze incoming support ticket from customer",
  "agent_id": "agent-001-ta",
  "status": "in_progress",
  "priority": "high",
  "created_at": "2026-02-09T19:15:00Z",
  "started_at": "2026-02-09T19:16:00Z",
  "due_date": "2026-02-09T20:00:00Z",
  "progress": 75,
  "metadata": {
    "ticket_id": "TICKET-2026-00542",
    "customer_name": "Jane Smith",
    "customer_email": "jane.smith@example.com",
    "subject": "Account login issues",
    "category": "technical",
    "urgency": "high",
    "sentiment": "frustrated"
  }
}
```

#### Task 2: Draft Response Email

```json
{
  "id": "task-002",
  "workflow_id": "wf-001-csa",
  "name": "Draft Response Email",
  "description": "Compose professional response to the support ticket",
  "agent_id": "agent-002-er",
  "status": "pending",
  "priority": "high",
  "created_at": "2026-02-09T19:16:00Z",
  "due_date": "2026-02-09T20:00:00Z",
  "depends_on": "task-001",
  "metadata": {
    "ticket_id": "TICKET-2026-00542",
    "tone": "professional_empathetic",
    "include_solution": true,
    "include_escalation_option": false
  }
}
```

#### Task 3: Evaluate Escalation Need

```json
{
  "id": "task-003",
  "workflow_id": "wf-001-csa",
  "name": "Evaluate Escalation Need",
  "description": "Determine if ticket needs human escalation",
  "agent_id": "agent-003-em",
  "status": "pending",
  "priority": "high",
  "created_at": "2026-02-09T19:16:00Z",
  "due_date": "2026-02-09T20:00:00Z",
  "depends_on": ["task-001", "task-002"],
  "metadata": {
    "ticket_id": "TICKET-2026-00542",
    "escalation_criteria": [
      "customer_vip_status",
      "issue_complexity",
      "agent_confidence"
    ]
  }
}
```

### Suggestions in This Workflow

#### Suggestion 1: Auto-Response Ready

```json
{
  "id": "sugg-001",
  "task_id": "task-002",
  "agent_id": "agent-002-er",
  "action": "send_response_email",
  "reasoning": "Email response is drafted and ready. Customer analysis complete. Issue is straightforward technical problem. Confidence: 95%",
  "status": "pending",
  "confidence": 0.95,
  "created_at": "2026-02-09T19:18:30Z",
  "suggested_data": {
    "recipient": "jane.smith@example.com",
    "subject": "Re: Account login issues - TICKET-2026-00542",
    "body": "Hi Jane,\n\nThank you for reaching out. We've identified the issue with your account login. Your password reset link has been sent to your email.\n\nPlease follow these steps:\n1. Check your email (including spam folder)\n2. Click the reset link\n3. Set a new password\n4. Try logging in again\n\nIf you continue to experience issues, please reply to this email.\n\nBest regards,\nCustomer Support Team"
  }
}
```

#### Suggestion 2: Escalation Not Needed

```json
{
  "id": "sugg-002",
  "task_id": "task-003",
  "agent_id": "agent-003-em",
  "action": "close_ticket_with_solution",
  "reasoning": "Issue is routine account reset. Customer is not VIP. Complexity is low. Suggested response is high quality. No escalation needed.",
  "status": "pending",
  "confidence": 0.99,
  "created_at": "2026-02-09T19:19:00Z"
}
```

### Approval Workflow

#### Human Reviews Task 2

```json
{
  "id": "comment-001",
  "task_id": "task-002",
  "author_id": "human-001",
  "author_type": "human",
  "author_name": "Sarah Manager",
  "text": "Good response! One small change: Add a link to our help article about password resets.",
  "created_at": "2026-02-09T19:19:45Z"
}
```

#### Agent Refines Response

```json
{
  "id": "comment-002",
  "task_id": "task-002",
  "author_id": "agent-002-er",
  "author_type": "agent",
  "text": "Updated email with help article link. New version ready for review.",
  "created_at": "2026-02-09T19:20:00Z"
}
```

#### Human Approves Suggestion

```json
{
  "id": "approval-001",
  "suggestion_id": "sugg-001",
  "approved_by": "human-001",
  "status": "approved",
  "notes": "Looks great! Send the response.",
  "created_at": "2026-02-09T19:20:15Z"
}
```

#### System Sends Email

```json
{
  "id": "task-002-action",
  "type": "email_sent",
  "timestamp": "2026-02-09T19:20:20Z",
  "details": {
    "recipient": "jane.smith@example.com",
    "status": "sent",
    "delivery_id": "msg-20260209-001"
  }
}
```

---

## Complete Mock Data JSON

Use this to seed your database:

### Workflows Seed Data

```json
[
  {
    "id": "wf-001-csa",
    "name": "Customer Support Automation",
    "description": "Automated ticket analysis and response",
    "status": "running",
    "progress": 65,
    "created_at": "2026-02-09T09:00:00Z",
    "updated_at": "2026-02-09T19:20:00Z"
  },
  {
    "id": "wf-002-dm",
    "name": "Data Migration Pipeline",
    "description": "Migrate customer data between systems",
    "status": "completed",
    "progress": 100,
    "created_at": "2026-02-08T10:00:00Z",
    "updated_at": "2026-02-09T15:30:00Z"
  },
  {
    "id": "wf-003-qc",
    "name": "Quality Control Review",
    "description": "Automated quality checks on content",
    "status": "running",
    "progress": 30,
    "created_at": "2026-02-09T18:00:00Z",
    "updated_at": "2026-02-09T19:15:00Z"
  }
]
```

### Agents Seed Data

```json
[
  {
    "id": "agent-001-ta",
    "name": "TicketAnalyzer",
    "status": "online",
    "capabilities": ["parse_email", "classify_issue", "prioritize"],
    "success_rate": 0.98,
    "total_tasks": 1247,
    "failed_tasks": 25
  },
  {
    "id": "agent-002-er",
    "name": "EmailResponder",
    "status": "online",
    "capabilities": ["draft_response", "verify_accuracy", "apply_tone"],
    "success_rate": 0.96,
    "total_tasks": 856,
    "failed_tasks": 34
  },
  {
    "id": "agent-003-em",
    "name": "EscalationManager",
    "status": "online",
    "capabilities": ["detect_complexity", "assess_urgency", "route_to_specialist"],
    "success_rate": 0.99,
    "total_tasks": 1247,
    "failed_tasks": 12
  },
  {
    "id": "agent-004-dc",
    "name": "DataConverter",
    "status": "offline",
    "capabilities": ["validate_data", "transform_format", "handle_errors"],
    "success_rate": 0.94,
    "total_tasks": 543,
    "failed_tasks": 33
  },
  {
    "id": "agent-005-qc",
    "name": "QualityChecker",
    "status": "busy",
    "capabilities": ["spell_check", "grammar_check", "style_verification"],
    "success_rate": 0.97,
    "total_tasks": 892,
    "failed_tasks": 27
  }
]
```

### Tasks Seed Data

```json
[
  {
    "id": "task-001",
    "workflow_id": "wf-001-csa",
    "agent_id": "agent-001-ta",
    "name": "Analyze Support Ticket",
    "status": "in_progress",
    "priority": "high",
    "created_at": "2026-02-09T19:15:00Z",
    "started_at": "2026-02-09T19:16:00Z",
    "progress": 75
  },
  {
    "id": "task-002",
    "workflow_id": "wf-001-csa",
    "agent_id": "agent-002-er",
    "name": "Draft Response Email",
    "status": "pending",
    "priority": "high",
    "created_at": "2026-02-09T19:16:00Z"
  },
  {
    "id": "task-003",
    "workflow_id": "wf-001-csa",
    "agent_id": "agent-003-em",
    "name": "Evaluate Escalation Need",
    "status": "pending",
    "priority": "high",
    "created_at": "2026-02-09T19:16:00Z"
  },
  {
    "id": "task-100",
    "workflow_id": "wf-002-dm",
    "agent_id": "agent-004-dc",
    "name": "Validate Customer Data",
    "status": "completed",
    "priority": "high",
    "created_at": "2026-02-08T10:00:00Z",
    "started_at": "2026-02-08T10:05:00Z",
    "completed_at": "2026-02-08T12:30:00Z",
    "duration_seconds": 8700
  },
  {
    "id": "task-200",
    "workflow_id": "wf-003-qc",
    "agent_id": "agent-005-qc",
    "name": "Quality Check: Articles",
    "status": "in_progress",
    "priority": "medium",
    "created_at": "2026-02-09T18:00:00Z",
    "started_at": "2026-02-09T18:05:00Z",
    "progress": 30
  }
]
```

### Suggestions Seed Data

```json
[
  {
    "id": "sugg-001",
    "task_id": "task-002",
    "agent_id": "agent-002-er",
    "action": "send_response_email",
    "reasoning": "Email response is ready. High confidence.",
    "status": "pending",
    "confidence": 0.95,
    "created_at": "2026-02-09T19:18:30Z"
  },
  {
    "id": "sugg-002",
    "task_id": "task-003",
    "agent_id": "agent-003-em",
    "action": "close_ticket_with_solution",
    "reasoning": "No escalation needed. Issue is straightforward.",
    "status": "pending",
    "confidence": 0.99,
    "created_at": "2026-02-09T19:19:00Z"
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
    "created_at": "2026-02-08T12:30:00Z"
  }
]
```

---

## WebSocket Event Examples

### Real-time Workflow Update

```json
{
  "type": "workflow_update",
  "data": {
    "id": "wf-001-csa",
    "status": "running",
    "progress": 65,
    "agents": [
      {
        "id": "agent-001-ta",
        "status": "executing_task",
        "current_task": "task-001"
      },
      {
        "id": "agent-002-er",
        "status": "waiting",
        "current_task": null
      },
      {
        "id": "agent-003-em",
        "status": "idle",
        "current_task": null
      }
    ]
  }
}
```

### Agent Status Update

```json
{
  "type": "agent_status",
  "data": {
    "agent_id": "agent-001-ta",
    "status": "executing_task",
    "current_task": "task-001",
    "progress": 75,
    "timestamp": "2026-02-09T19:20:00Z"
  }
}
```

### Task Update

```json
{
  "type": "task_update",
  "data": {
    "id": "task-001",
    "status": "in_progress",
    "progress": 75,
    "agent_id": "agent-001-ta",
    "timestamp": "2026-02-09T19:20:00Z"
  }
}
```

### New Suggestion

```json
{
  "type": "suggestion_created",
  "data": {
    "id": "sugg-001",
    "task_id": "task-002",
    "agent_id": "agent-002-er",
    "action": "send_response_email",
    "confidence": 0.95,
    "created_at": "2026-02-09T19:18:30Z"
  }
}
```

---

## Using Mock Data in Development

### Option 1: Manual Insertion via API

```bash
# Create workflow
curl -X POST http://localhost:8000/api/workflows \
  -H "Content-Type: application/json" \
  -d @workflows.json

# Create agents
curl -X POST http://localhost:8000/api/agents \
  -H "Content-Type: application/json" \
  -d @agents.json

# etc.
```

### Option 2: Database Seeding Script

Create `backend/seed_db.py`:

```python
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session
from app.models import Workflow, Agent, Task
from mock_data import WORKFLOWS, AGENTS, TASKS

async def seed():
    async with async_session() as session:
        for wf_data in WORKFLOWS:
            workflow = Workflow(**wf_data)
            session.add(workflow)
        
        for agent_data in AGENTS:
            agent = Agent(**agent_data)
            session.add(agent)
        
        # ... add tasks, suggestions
        
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())
```

Run: `python backend/seed_db.py`

### Option 3: Docker Initialization

In `docker-compose.yml`, add volume to initialize:

```yaml
postgres:
  volumes:
    - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
```

---

## Testing the Mock Data

Once seeded:

1. Visit dashboard: `http://localhost:3000`
2. See workflows, agents, tasks listed
3. Open WebSocket inspector (browser dev tools)
4. Subscribe to `workflows` channel
5. Manually update a task via API
6. Watch real-time update in WebSocket

Example:

```bash
# Update task status
curl -X PUT http://localhost:8000/api/tasks/task-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Watch WebSocket for update
# Should see: {"type": "task_update", "data": {...}}
```

---

**Last Updated:** February 2026  
**Mock Data Version:** 1.0
