# API Documentation

Complete reference for Workflow Factory Dashboard API endpoints and WebSocket events.

## Base URL

```
HTTP:  http://localhost:8000
WS:    ws://localhost:8000
```

Production URLs will vary by deployment.

## Authentication

(To be implemented in Phase 3)

Currently, all endpoints are open. In production, use:
- JWT Bearer tokens for REST API
- Token validation on WebSocket connection

```bash
# Include in Authorization header
Authorization: Bearer <token>
```

## REST API Endpoints

### Health Check

**Check system status**

```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-09T19:20:00Z",
  "version": "0.1.0"
}
```

---

## Workflows

### List Workflows

```
GET /api/workflows
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 50)
- `status`: Filter by status (running, completed, failed)

**Response:**
```json
{
  "total": 10,
  "items": [
    {
      "id": "wf-001",
      "name": "Customer Support Automation",
      "description": "Automated ticket analysis and response",
      "status": "running",
      "created_at": "2026-02-09T10:00:00Z",
      "updated_at": "2026-02-09T19:15:00Z",
      "progress": 65,
      "agent_ids": ["agent-1", "agent-2"],
      "task_count": 5,
      "completed_tasks": 3
    }
  ]
}
```

### Get Workflow

```
GET /api/workflows/{workflow_id}
```

**Response:**
```json
{
  "id": "wf-001",
  "name": "Customer Support Automation",
  "description": "Automated ticket analysis and response",
  "status": "running",
  "created_at": "2026-02-09T10:00:00Z",
  "updated_at": "2026-02-09T19:15:00Z",
  "progress": 65,
  "agent_ids": ["agent-1", "agent-2"],
  "tasks": [
    {
      "id": "task-1",
      "name": "Analyze Ticket",
      "status": "completed",
      "agent_id": "agent-1"
    }
  ],
  "suggestions": [
    {
      "id": "sugg-1",
      "agent_id": "agent-2",
      "action": "Send response",
      "reasoning": "Ticket resolved, ready to send reply",
      "status": "pending"
    }
  ]
}
```

### Create Workflow

```
POST /api/workflows
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Email Campaign Automation",
  "description": "Send targeted emails based on user behavior",
  "agent_ids": ["agent-1"],
  "trigger": {
    "type": "manual"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "wf-new-123",
  "name": "Email Campaign Automation",
  ...
}
```

### Update Workflow

```
PUT /api/workflows/{workflow_id}
Content-Type: application/json
```

**Request Body:** (same as create, only changed fields needed)

**Response:** `200 OK`

### Delete Workflow

```
DELETE /api/workflows/{workflow_id}
```

**Response:** `204 No Content`

---

## Agents

### List Agents

```
GET /api/agents
```

**Response:**
```json
{
  "total": 3,
  "items": [
    {
      "id": "agent-1",
      "name": "TicketAnalyzer",
      "status": "online",
      "capabilities": ["analyze", "classify", "prioritize"],
      "current_task_id": "task-1",
      "success_rate": 0.98,
      "total_tasks": 100,
      "failed_tasks": 2,
      "last_seen": "2026-02-09T19:19:00Z"
    }
  ]
}
```

### Get Agent

```
GET /api/agents/{agent_id}
```

**Response:**
```json
{
  "id": "agent-1",
  "name": "TicketAnalyzer",
  "status": "online",
  "capabilities": ["analyze", "classify", "prioritize"],
  "current_task_id": "task-1",
  "success_rate": 0.98,
  "total_tasks": 100,
  "failed_tasks": 2,
  "last_seen": "2026-02-09T19:19:00Z",
  "recent_tasks": [
    {
      "id": "task-50",
      "name": "Analyze Ticket",
      "status": "completed",
      "duration_seconds": 45
    }
  ]
}
```

---

## Tasks

### List Tasks

```
GET /api/tasks
```

**Query Parameters:**
- `status`: pending, in_progress, completed, failed
- `agent_id`: Filter by assigned agent
- `workflow_id`: Filter by workflow

**Response:**
```json
{
  "total": 50,
  "items": [
    {
      "id": "task-1",
      "name": "Analyze Ticket",
      "description": "Parse support ticket and extract key info",
      "status": "completed",
      "workflow_id": "wf-001",
      "agent_id": "agent-1",
      "priority": "high",
      "due_date": "2026-02-09T20:00:00Z",
      "created_at": "2026-02-09T10:00:00Z",
      "started_at": "2026-02-09T10:05:00Z",
      "completed_at": "2026-02-09T10:50:00Z",
      "duration_seconds": 2700
    }
  ]
}
```

### Get Task

```
GET /api/tasks/{task_id}
```

**Response:**
```json
{
  "id": "task-1",
  "name": "Analyze Ticket",
  ...
  "suggestions": [
    {
      "id": "sugg-1",
      "agent_id": "agent-2",
      "action": "Send response",
      "reasoning": "Ticket category detected as billing issue",
      "status": "approved"
    }
  ],
  "comments": [
    {
      "id": "comment-1",
      "author": "human-user-1",
      "text": "Good analysis, but consider the customer history",
      "created_at": "2026-02-09T11:00:00Z"
    }
  ]
}
```

### Create Task

```
POST /api/tasks
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Draft Email Response",
  "description": "Write a professional response to the support ticket",
  "workflow_id": "wf-001",
  "agent_id": "agent-2",
  "priority": "high",
  "due_date": "2026-02-09T20:00:00Z"
}
```

**Response:** `201 Created`

### Update Task

```
PUT /api/tasks/{task_id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "priority": "medium"
}
```

**Response:** `200 OK`

---

## Suggestions

### List Suggestions

```
GET /api/suggestions
```

**Query Parameters:**
- `status`: pending, approved, rejected
- `task_id`: Filter by task
- `agent_id`: Filter by agent

**Response:**
```json
{
  "total": 15,
  "items": [
    {
      "id": "sugg-1",
      "task_id": "task-1",
      "agent_id": "agent-2",
      "action": "Send response email",
      "reasoning": "Customer issue resolved, ticket ready to close",
      "status": "pending",
      "confidence": 0.95,
      "created_at": "2026-02-09T11:00:00Z"
    }
  ]
}
```

### Create Suggestion

```
POST /api/suggestions
Content-Type: application/json
```

**Request Body:**
```json
{
  "task_id": "task-1",
  "agent_id": "agent-2",
  "action": "Send response email",
  "reasoning": "Customer issue resolved, ticket ready to close",
  "confidence": 0.95
}
```

**Response:** `201 Created`

### Approve Suggestion

```
POST /api/suggestions/{suggestion_id}/approve
Content-Type: application/json
```

**Request Body:**
```json
{
  "approved_by": "human-user-1",
  "notes": "Looks good, proceed"
}
```

**Response:** `200 OK`
```json
{
  "id": "sugg-1",
  "status": "approved",
  "approved_at": "2026-02-09T11:30:00Z",
  "approved_by": "human-user-1"
}
```

### Reject Suggestion

```
POST /api/suggestions/{suggestion_id}/reject
Content-Type: application/json
```

**Request Body:**
```json
{
  "rejected_by": "human-user-1",
  "reason": "Need to check customer history first"
}
```

**Response:** `200 OK`

---

## WebSocket (Real-time Updates)

Connect to `ws://localhost:8000/ws` to receive real-time updates.

### Connection

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  // Subscribe to channels
  ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'workflows'
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Update:', update);
};
```

### Available Channels

- `workflows` – All workflow updates
- `agents` – All agent status updates
- `tasks` – All task updates
- `suggestions` – All suggestion updates
- `workflow:{id}` – Updates for specific workflow
- `agent:{id}` – Updates for specific agent
- `task:{id}` – Updates for specific task

### Event Types

#### Workflow Events

```json
{
  "type": "workflow_update",
  "data": {
    "id": "wf-001",
    "status": "running",
    "progress": 65,
    "agents": [
      {
        "id": "agent-1",
        "status": "executing_task",
        "current_task": "task-1"
      }
    ]
  }
}
```

#### Agent Events

```json
{
  "type": "agent_status",
  "data": {
    "agent_id": "agent-1",
    "status": "online",
    "executing_task": "task-1",
    "timestamp": "2026-02-09T19:20:00Z"
  }
}
```

#### Task Events

```json
{
  "type": "task_update",
  "data": {
    "id": "task-1",
    "status": "in_progress",
    "agent_id": "agent-1",
    "progress": 75,
    "timestamp": "2026-02-09T19:20:00Z"
  }
}
```

#### Suggestion Events

```json
{
  "type": "suggestion_created",
  "data": {
    "id": "sugg-1",
    "task_id": "task-1",
    "agent_id": "agent-2",
    "action": "Send response",
    "confidence": 0.95
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**

- `200 OK` – Request succeeded
- `201 Created` – Resource created successfully
- `204 No Content` – Request succeeded (no response body)
- `400 Bad Request` – Invalid request data
- `404 Not Found` – Resource not found
- `409 Conflict` – Resource state conflict
- `500 Internal Server Error` – Server error

### Example Error Response

```
Status: 404 Not Found

{
  "detail": "Workflow with id 'wf-xyz' not found"
}
```

---

## Rate Limiting

(To be implemented in production)

- REST API: 100 requests per minute per IP
- WebSocket: 10 messages per second per connection

---

## Pagination

List endpoints support pagination:

```
GET /api/workflows?skip=0&limit=20
```

Response includes:
- `total` – Total items available
- `items` – Array of items in this page
- `skip` – Number of items skipped
- `limit` – Limit applied

---

## Examples

### Example: Create and Monitor a Workflow

**1. Create workflow**
```bash
curl -X POST http://localhost:8000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Email Automation",
    "description": "Send targeted emails",
    "agent_ids": ["agent-1"]
  }'
```

**2. Create task**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Select Recipients",
    "workflow_id": "wf-new-123",
    "agent_id": "agent-1",
    "priority": "high"
  }'
```

**3. Subscribe to WebSocket**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'workflow:wf-new-123'
  }));
};
ws.onmessage = (event) => {
  console.log('Update:', JSON.parse(event.data));
};
```

---

## Testing the API

Use Swagger UI at `http://localhost:8000/docs` for interactive testing.

Or use curl:
```bash
# List workflows
curl http://localhost:8000/api/workflows

# Get health
curl http://localhost:8000/api/health
```

---

**Last Updated:** February 2026  
**API Version:** 0.1.0
