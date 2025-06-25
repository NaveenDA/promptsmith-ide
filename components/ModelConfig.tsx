'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from './ui/badge'

interface ModelConfigProps {
  onChange?: (config: ModelSettings) => void
}

interface ModelSettings {
  model: string
  temperature: number
  topP: number
  maxTokens: number
  presencePenalty: number
  frequencyPenalty: number
}

const MODEL_NAMES: Record<string, string> = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5',
  'claude-2': 'Claude 2',
  'claude-instant': 'Claude Instant'
}

export function ModelConfig({ onChange }: ModelConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [settings, setSettings] = useState<ModelSettings>({
    model: 'gpt-4',
    temperature: 0.7,
    topP: 1,
    maxTokens: 2048,
    presencePenalty: 0,
    frequencyPenalty: 0,
  })

  const handleChange = (key: keyof ModelSettings, value: number | string) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onChange?.(newSettings)
  }

  return (
    <div className="space-y-4">
      {/* Header with Badge */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Model Configuration</h2>
          {!isExpanded && (
            <Badge variant="secondary" className="text-sm">
              {MODEL_NAMES[settings.model]} • t={settings.temperature}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expanded Configuration */}
      {isExpanded && (
        <div className="space-y-4 p-4 border rounded-lg bg-card animate-in slide-in-from-top duration-300">
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2"
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-2">Claude 2</option>
              <option value="claude-instant">Claude Instant</option>
            </select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12">{settings.temperature}</span>
            </div>
          </div>

          {/* Top P */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Top P</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.topP}
                onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12">{settings.topP}</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Tokens</label>
            <input
              type="number"
              min="1"
              max="32000"
              value={settings.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          {/* Presence Penalty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Presence Penalty</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.presencePenalty}
                onChange={(e) => handleChange('presencePenalty', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12">{settings.presencePenalty}</span>
            </div>
          </div>

          {/* Frequency Penalty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency Penalty</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={settings.frequencyPenalty}
                onChange={(e) => handleChange('frequencyPenalty', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12">{settings.frequencyPenalty}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 