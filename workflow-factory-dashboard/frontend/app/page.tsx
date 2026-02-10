'use client';

import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import { WorkflowStatus } from '@/components/dashboard/WorkflowStatus';
import { AgentMetrics } from '@/components/dashboard/AgentMetrics';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { useApi } from '@/lib/hooks/useApi';

export default function DashboardPage() {
  const { data: stats, isLoading } = useApi('/api/workflows');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of workflows, agents, and tasks
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Workflows */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Online Agents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Agents</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">5</p>
            </div>
            <Cpu className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">42</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Status - takes 2 cols on large screens */}
        <div className="lg:col-span-2">
          <WorkflowStatus />
        </div>

        {/* System Health - sidebar */}
        <div>
          <SystemHealth />
        </div>
      </div>

      {/* Agent Metrics */}
      <div>
        <AgentMetrics />
      </div>
    </div>
  );
}
