'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Play,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Trash2,
  Copy,
  Edit,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  status: 'success' | 'error' | 'warning' | 'pending' | 'running'
  response?: string
  latency?: number
  tokens?: number
  cost?: number
}

interface TestGroup {
  id: string
  name: string
  description?: string
  tests: TestCase[]
}

export function TestCases() {
  const [groups, setGroups] = useState<TestGroup[]>([
    {
      id: 'basic',
      name: 'Basic Tests',
      description: 'Basic functionality tests',
      tests: [
        {
          id: 'test1',
          name: 'Normal Use Case',
          input: 'Sample input for normal use case',
          expectedOutput: 'Expected output for normal case',
          status: 'success',
          response: 'Actual response matches expected output',
          latency: 1200,
          tokens: 150,
          cost: 0.002,
        },
        {
          id: 'test2',
          name: 'Edge Case',
          input: 'Sample input for edge case',
          expectedOutput: 'Expected output for edge case',
          status: 'error',
          response: 'Response does not match expected output',
          latency: 800,
          tokens: 100,
          cost: 0.001,
        },
      ],
    },
    {
      id: 'security',
      name: 'Security Tests',
      description: 'Tests for security vulnerabilities',
      tests: [
        {
          id: 'security1',
          name: 'Prompt Injection',
          input: 'Attempt to inject malicious prompt',
          expectedOutput: 'Should handle injection safely',
          status: 'warning',
          response: 'Potential security concern detected',
          latency: 900,
          tokens: 120,
          cost: 0.0015,
        },
      ],
    },
  ])

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    basic: true,
    security: true,
  })

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'running':
        return (
          <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
        )
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">Test Cases</h3>
          <Badge variant="outline" className="text-xs">
            {groups.reduce((acc, group) => acc + group.tests.length, 0)} tests
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="default" size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            Run All
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {groups.map((group) => (
          <div key={group.id} className="border-b">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              {expandedGroups[group.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium text-gray-700">{group.name}</span>
              <Badge variant="outline" className="text-xs ml-2">
                {group.tests.length}
              </Badge>
            </button>

            {expandedGroups[group.id] && (
              <div className="px-3 pb-2">
                {group.description && (
                  <p className="text-sm text-gray-500 mb-2">{group.description}</p>
                )}
                <div className="space-y-2">
                  {group.tests.map((test) => (
                    <div
                      key={test.id}
                      className="p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <span className="flex-1 text-gray-700">{test.name}</span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {test.status !== 'pending' && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
                          <span>Latency: {test.latency}ms</span>
                          <span>Tokens: {test.tokens}</span>
                          <span>Cost: ${test.cost}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 