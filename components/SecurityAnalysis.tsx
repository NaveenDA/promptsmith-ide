'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

interface SecurityIssue {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  recommendation: string
  example?: string
  learnMoreUrl?: string
}

interface SecurityCategory {
  id: string
  name: string
  description: string
  issues: SecurityIssue[]
}

export function SecurityAnalysis() {
  const [categories, setCategories] = useState<SecurityCategory[]>([
    {
      id: 'injection',
      name: 'Prompt Injection',
      description: 'Analysis of potential prompt injection vulnerabilities',
      issues: [
        {
          id: 'direct-injection',
          type: 'critical',
          title: 'Direct Prompt Injection Vulnerability',
          description: 'The prompt contains unvalidated user input that could be used to manipulate the model\'s behavior.',
          recommendation: 'Add input validation and sanitization. Consider using a template system with clear boundaries between static and dynamic content.',
          example: 'Instead of: "Process this text: {{user_input}}"\nUse: "Process this invoice using the following format: {{sanitized_input}}"',
          learnMoreUrl: 'https://example.com/prompt-injection',
        },
        {
          id: 'indirect-injection',
          type: 'warning',
          title: 'Indirect Prompt Manipulation',
          description: 'User input could indirectly influence the model\'s behavior through context manipulation.',
          recommendation: 'Implement strict input validation and consider using role-based prompting.',
          learnMoreUrl: 'https://example.com/indirect-injection',
        },
      ],
    },
    {
      id: 'data-leakage',
      name: 'Data Leakage',
      description: 'Detection of potential sensitive data exposure',
      issues: [
        {
          id: 'pii-exposure',
          type: 'critical',
          title: 'PII Exposure Risk',
          description: 'The prompt might expose or process Personally Identifiable Information (PII) without proper safeguards.',
          recommendation: 'Implement PII detection and redaction. Use data minimization principles.',
          example: 'Use regex patterns to detect and redact email addresses, phone numbers, etc.',
        },
      ],
    },
    {
      id: 'output-validation',
      name: 'Output Validation',
      description: 'Analysis of output validation and sanitization',
      issues: [
        {
          id: 'format-validation',
          type: 'info',
          title: 'Missing Output Format Validation',
          description: 'The prompt doesn\'t explicitly validate or sanitize the model\'s output format.',
          recommendation: 'Add explicit output format requirements and validation steps.',
          example: 'Add: "Your response must be valid JSON with the following schema: {...}"',
        },
      ],
    },
  ])

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    injection: true,
    'data-leakage': true,
    'output-validation': true,
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getIssueBadge = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical':
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )
      case 'warning':
        return (
          <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
            Warning
          </Badge>
        )
      case 'info':
        return (
          <Badge variant="outline" className="text-xs text-blue-500 border-blue-500">
            Info
          </Badge>
        )
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <h3 className="text-sm font-medium text-gray-700">Security Analysis</h3>
        </div>
        <Button variant="default" size="sm" className="gap-2">
          <Shield className="w-4 h-4" />
          Run Analysis
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {categories.map((category) => (
          <div key={category.id} className="border-b">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              {expandedCategories[category.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium text-gray-700">{category.name}</span>
              <Badge variant="outline" className="text-xs ml-2">
                {category.issues.length}
              </Badge>
            </button>

            {expandedCategories[category.id] && (
              <div className="px-3 pb-2">
                <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                <div className="space-y-2">
                  {category.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getIssueIcon(issue.type)}
                        <span className="flex-1 font-medium text-gray-700">
                          {issue.title}
                        </span>
                        {getIssueBadge(issue.type)}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{issue.description}</p>
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Recommendation: </span>
                        {issue.recommendation}
                      </div>
                      {issue.example && (
                        <div className="mt-2 text-sm font-mono bg-white p-2 rounded border">
                          {issue.example}
                        </div>
                      )}
                      {issue.learnMoreUrl && (
                        <a
                          href={issue.learnMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1"
                        >
                          Learn more
                          <ExternalLink className="w-3 h-3" />
                        </a>
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