'use client'

import { useState } from 'react'
import { Button } from './ui/button'

interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  status: 'pending' | 'passed' | 'failed'
}

interface TestCasesProps {
  onRunTests?: (testCases: TestCase[]) => void
}

export function TestCases({ onRunTests }: TestCasesProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [isAddingTest, setIsAddingTest] = useState(false)

  const handleAddTest = () => {
    const newTest: TestCase = {
      id: Date.now().toString(),
      name: `Test Case ${testCases.length + 1}`,
      input: '',
      expectedOutput: '',
      status: 'pending'
    }
    setTestCases([...testCases, newTest])
    setIsAddingTest(true)
  }

  const handleRunTests = () => {
    onRunTests?.(testCases)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Test Cases</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleAddTest}>
            Add Test
          </Button>
          <Button size="sm" onClick={handleRunTests}>
            Run All Tests
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {testCases.map((test) => (
          <div
            key={test.id}
            className="p-4 border rounded-lg bg-card"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{test.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                test.status === 'passed' ? 'bg-green-100 text-green-800' :
                test.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Input:</label>
                <textarea
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  rows={2}
                  value={test.input}
                  onChange={(e) => {
                    const updatedTests = testCases.map((t) =>
                      t.id === test.id ? { ...t, input: e.target.value } : t
                    )
                    setTestCases(updatedTests)
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Output:</label>
                <textarea
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  rows={2}
                  value={test.expectedOutput}
                  onChange={(e) => {
                    const updatedTests = testCases.map((t) =>
                      t.id === test.id ? { ...t, expectedOutput: e.target.value } : t
                    )
                    setTestCases(updatedTests)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 