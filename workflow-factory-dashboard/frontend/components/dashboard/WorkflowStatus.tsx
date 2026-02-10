'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function WorkflowStatus() {
  const workflows = [
    {
      id: 'wf-001',
      name: 'Customer Support Automation',
      status: 'running',
      progress: 65,
      agents: 3,
    },
    {
      id: 'wf-002',
      name: 'Data Migration Pipeline',
      status: 'completed',
      progress: 100,
      agents: 2,
    },
    {
      id: 'wf-003',
      name: 'Quality Control Review',
      status: 'running',
      progress: 30,
      agents: 1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Workflow Status</h2>
      </div>
      <div className="divide-y">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(workflow.status)}
                <div>
                  <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600">{workflow.agents} agents</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                workflow.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : workflow.status === 'running'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {workflow.status}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  workflow.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${workflow.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{workflow.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
