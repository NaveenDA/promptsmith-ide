"use client";

import {
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Cpu,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Tooltip } from "./ui/tooltip";

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className }: StatusBarProps) {
  // Example data - in real app, this would come from state/props
  const stats = {
    tests: {
      passed: 8,
      total: 10,
      running: false,
    },
    security: {
      passed: 5,
      total: 6,
      critical: 1,
    },
    costs: {
      current: 0.015,
      last24h: 0.125,
    },
    model: {
      provider: "OpenAI",
      name: "gpt-4",
      version: "0125-preview",
      temperature: 0.7,
    },
    performance: {
      avgLatency: 850, // ms
      tokensUsed: 15420,
      lastRun: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    },
  };

  return (
    <div
      className={cn(
        "h-6 bg-gray-50 border-t flex items-center text-xs px-2 text-gray-600",
        className
      )}
    >
      {/* Test Cases Status */}
      <div className="flex items-center gap-2 px-2 border-r">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>
            Tests: {stats.tests.passed}/{stats.tests.total}
          </span>
        </div>
        {stats.tests.running && (
          <Badge variant="outline" className="text-[10px] h-4 bg-blue-50">
            Running...
          </Badge>
        )}
      </div>

      {/* Security Issues */}
      <div className="flex items-center gap-1 px-2 border-r">
        <AlertTriangle
          className={cn(
            "w-3.5 h-3.5",
            stats.security.critical > 0 ? "text-red-500" : "text-green-500"
          )}
        />
        <span>
          Security: {stats.security.passed}/{stats.security.total}
        </span>
        {stats.security.critical > 0 && (
          <Badge variant="destructive" className="text-[10px] h-4">
            {stats.security.critical} Critical
          </Badge>
        )}
      </div>

      {/* Costs */}
      <Tooltip content={`Last 24h: $${stats.costs.last24h}`}>
        <div className="flex items-center gap-1 px-2 border-r">
          <DollarSign className="w-3.5 h-3.5 text-blue-500" />
          <span>Cost: ${stats.costs.current}</span>
        </div>
      </Tooltip>

      {/* Performance */}
      <Tooltip content={`Last run: ${stats.performance.lastRun.toLocaleTimeString()}`}>
        <div className="flex items-center gap-2 px-2 border-r">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span>{stats.performance.avgLatency}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>{(stats.performance.tokensUsed / 1000).toFixed(1)}k tokens</span>
          </div>
        </div>
      </Tooltip>

      {/* Model Info */}
      <div className="flex items-center gap-2 px-2 ml-auto">
        <Tooltip content="Model Configuration">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {stats.model.provider} / {stats.model.name}
            </span>
            <Badge variant="outline" className="text-[10px] h-4">
              {stats.model.version}
            </Badge>
          </div>
        </Tooltip>
        <Tooltip content="Model Temperature">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-gray-400" />
            <span>{stats.model.temperature}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
} 