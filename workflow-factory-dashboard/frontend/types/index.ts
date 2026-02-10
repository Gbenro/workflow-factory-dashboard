/**
 * Workflow Factory Dashboard - Type Definitions
 */

// Workflow Types
export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
export type AgentStatus = 'online' | 'offline' | 'busy' | 'idle';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  progress: number; // 0-100
  agentIds: string[];
  taskCount: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  capabilities: string[];
  successRate: number; // 0-1
  totalTasks: number;
  failedTasks: number;
  currentTaskId?: string;
  lastSeen: string;
}

export interface Task {
  id: string;
  workflowId: string;
  agentId?: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  progress?: number;
  dueDate?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
}

export interface Suggestion {
  id: string;
  taskId: string;
  agentId: string;
  action: string;
  reasoning: string;
  status: SuggestionStatus;
  confidence: number; // 0-1
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorType: 'human' | 'agent';
  text: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

// WebSocket Event Types
export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp?: string;
}

export interface WorkflowUpdateEvent {
  type: 'workflow_update';
  data: Partial<Workflow> & { id: string };
}

export interface TaskUpdateEvent {
  type: 'task_update';
  data: Partial<Task> & { id: string };
}

export interface AgentStatusEvent {
  type: 'agent_status';
  data: {
    agentId: string;
    status: AgentStatus;
    currentTask?: string;
    timestamp: string;
  };
}

export interface SuggestionEvent {
  type: 'suggestion_created' | 'suggestion_updated' | 'suggestion_approved' | 'suggestion_rejected';
  data: Suggestion;
}

// Form Types
export interface CreateWorkflowForm {
  name: string;
  description?: string;
  agentIds: string[];
}

export interface CreateTaskForm {
  name: string;
  description?: string;
  workflowId: string;
  agentId?: string;
  priority: Priority;
  dueDate?: string;
}

export interface CreateSuggestionForm {
  taskId: string;
  agentId: string;
  action: string;
  reasoning: string;
  confidence: number;
}

// UI Component Props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FilterProps {
  status?: string;
  priority?: Priority;
  agentId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
