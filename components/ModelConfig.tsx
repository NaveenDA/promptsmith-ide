'use client'

import { useState } from 'react'
import {
  Settings,
  Thermometer,
  Zap,
  Info,
  ChevronDown,
  Star,
  Clock,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Badge } from './ui/badge'
import { Slider } from './ui/slider'

interface ModelConfigProps {
  className?: string
}

interface ModelPreset {
  name: string
  provider: string
  model: string
  temperature: number
  description: string
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    name: 'Balanced',
    provider: 'OpenAI',
    model: 'gpt-4',
    temperature: 0.7,
    description: 'Good balance of creativity and precision',
  },
  {
    name: 'Creative',
    provider: 'OpenAI',
    model: 'gpt-4',
    temperature: 0.9,
    description: 'More creative and varied responses',
  },
  {
    name: 'Precise',
    provider: 'OpenAI',
    model: 'gpt-4',
    temperature: 0.2,
    description: 'More deterministic and focused responses',
  },
]

export function ModelConfig({ className }: ModelConfigProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('Balanced')
  const [temperature, setTemperature] = useState(0.7)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const currentPreset = MODEL_PRESETS.find(p => p.name === selectedPreset)!

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0])
    // Clear preset if temperature is changed manually
    if (value[0] !== currentPreset.temperature) {
      setSelectedPreset('')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 pr-2 font-normal"
          >
            <Settings className="h-3.5 w-3.5" />
            {currentPreset.provider} / {currentPreset.model}
            <Badge variant="secondary" className="h-5 text-[10px]">
              0125-preview
            </Badge>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Model Configuration</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4" />
                  <label className="text-sm font-medium">Temperature</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Controls randomness: Lower values are more focused, higher values more creative
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[temperature]}
                    onValueChange={handleTemperatureChange}
                    min={0}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm tabular-nums w-10">{temperature}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Presets
                </label>
                <DropdownMenuRadioGroup value={selectedPreset} onValueChange={setSelectedPreset}>
                  {MODEL_PRESETS.map((preset) => (
                    <DropdownMenuRadioItem
                      key={preset.name}
                      value={preset.name}
                      className="flex flex-col items-start py-2"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description}</div>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3.5 w-3.5 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          Response Time: ~1.2s
        </TooltipContent>
        <Badge variant="outline" className="h-8 gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Fast
        </Badge>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3.5 w-3.5 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          Estimated cost per request: $0.01
        </TooltipContent>
        <Badge variant="outline" className="h-8 gap-1.5">
          <Zap className="h-3.5 w-3.5" />
          Low Cost
        </Badge>
      </Tooltip>
    </div>
  )
} 