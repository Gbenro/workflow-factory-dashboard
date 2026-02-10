'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export function AgentMetrics() {
  const agents = [
    {
      id: 'agent-1',
      name: 'TicketAnalyzer',
      status: 'online',
      successRate: 0.98,
      tasksCompleted: 1247,
      currentTask: 'task-001',
    },
    {
      id: 'agent-2',
      name: 'EmailResponder',
      status: 'online',
      successRate: 0.96,
      tasksCompleted: 856,
      currentTask: 'task-002',
    },
    {
      id: 'agent-3',
      name: 'EscalationManager',
      status: 'online',
      successRate: 0.99,
      tasksCompleted: 1247,
      currentTask: null,
    },
    {
      id: 'agent-4',
      name: 'DataConverter',
      status: 'offline',
      successRate: 0.94,
      tasksCompleted: 543,
      currentTask: null,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Agent Performance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Agent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Completed Tasks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Current Task
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {agent.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      agent.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {(agent.successRate * 100).toFixed(0)}%
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {agent.tasksCompleted}
                </td>
                <td className="px-6 py-4 text-sm">
                  {agent.currentTask ? (
                    <span className="text-blue-600">{agent.currentTask}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
