'use client'

import { useState, useEffect } from 'react'

interface SecurityIssue {
  id: string
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  suggestion: string
}

interface SecurityAnalysisProps {
  promptContent: string
}

export function SecurityAnalysis({ promptContent }: SecurityAnalysisProps) {
  const [vulnerabilityScore, setVulnerabilityScore] = useState(0)
  const [issues, setIssues] = useState<SecurityIssue[]>([])

  // This is a placeholder for actual security analysis logic
  useEffect(() => {
    if (!promptContent) return

    // Example security checks (to be replaced with actual implementation)
    const newIssues: SecurityIssue[] = []
    let score = 100

    // Check for common vulnerabilities
    if (promptContent.includes('system')) {
      newIssues.push({
        id: '1',
        severity: 'high',
        title: 'System Command Reference',
        description: 'Found reference to system commands which could be exploited',
        suggestion: 'Avoid using system command references in prompts'
      })
      score -= 30
    }

    if (promptContent.toLowerCase().includes('ignore')) {
      newIssues.push({
        id: '2',
        severity: 'medium',
        title: 'Instruction Override Attempt',
        description: 'Found potential instruction override keywords',
        suggestion: 'Remove or rephrase instructions that could be used to override system prompts'
      })
      score -= 20
    }

    setIssues(newIssues)
    setVulnerabilityScore(Math.max(0, score))
  }, [promptContent])

  return (
    <div className="space-y-6">
      {/* Vulnerability Score */}
      <div className="p-4 rounded-lg bg-card border">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Score</h3>
        <div className="flex items-center">
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                vulnerabilityScore > 70 ? 'bg-green-500' :
                vulnerabilityScore > 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${vulnerabilityScore}%` }}
            />
          </div>
          <span className="ml-4 font-medium">{vulnerabilityScore}</span>
        </div>
      </div>

      {/* Security Issues */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detected Issues</h3>
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No security issues detected</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-lg bg-card border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{issue.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                <p className="text-sm font-medium">Suggestion:</p>
                <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 