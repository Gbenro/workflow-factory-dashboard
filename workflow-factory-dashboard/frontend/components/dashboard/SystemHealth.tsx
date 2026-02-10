'use client';

import React from 'react';
import { Zap, Clock, Server } from 'lucide-react';

export function SystemHealth() {
  const health = {
    status: 'healthy',
    uptime: '99.5%',
    responseTime: '145ms',
    dbConnections: 12,
    maxConnections: 100,
    lastUpdated: new Date().toLocaleTimeString(),
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              {health.status}
            </span>
          </div>
        </div>

        {/* Uptime */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Uptime
            </p>
            <p className="text-sm font-semibold text-gray-900">{health.uptime}</p>
          </div>
        </div>

        {/* Response Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              API Response
            </p>
            <p className="text-sm font-semibold text-gray-900">{health.responseTime}</p>
          </div>
        </div>

        {/* Database Connections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Server className="w-4 h-4" />
              DB Connections
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {health.dbConnections}/{health.maxConnections}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(health.dbConnections / health.maxConnections) * 100}%` }}
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {health.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
