'use client'
import { useState } from "react"
import { Button } from "./ui/button"

interface PromptItem {
  id: string
  name: string
  description: string
}

interface DatasetItem {
  id: string
  name: string
  description: string
}

interface ToolItem {
  id: string
  name: string
  description: string
}

const LeftSidebar = () => {
    const [prompts, setPrompts] = useState<PromptItem[]>([
        { id: '1', name: 'Invoice Extractor', description: 'Extract information from invoices' },
        { id: '2', name: 'Email Classifier', description: 'Classify emails by intent' },
      ])
    
      const [datasets, setDatasets] = useState<DatasetItem[]>([
        { id: '1', name: 'Invoice Dataset', description: '1000 sample invoices' },
        { id: '2', name: 'Email Dataset', description: '500 sample emails' },
      ])
    
      const [tools, setTools] = useState<ToolItem[]>([
        { id: '1', name: 'Text Extractor', description: 'Extract text from images' },
        { id: '2', name: 'PDF Parser', description: 'Parse PDF documents' },
      ])
  return (
    <div className="min-w-64  bg-muted p-4 h-full">
        <div className="space-y-6">
          {/* Prompts Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Prompts</h2>
            <Button variant="outline" className="w-full mb-2">+ New Prompt</Button>
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-2 rounded bg-card hover:bg-accent cursor-pointer"
                >
                  <div className="font-medium">{prompt.name}</div>
                  <div className="text-sm text-muted-foreground">{prompt.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Datasets Section */}
          <div className="">
            <h2 className="text-lg font-semibold mb-2">Datasets</h2>
            <Button variant="outline" className="w-full mb-2">+ New Dataset</Button>
            <div className="space-y-2">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="p-2 rounded bg-card hover:bg-accent cursor-pointer"
                >
                  <div className="font-medium">{dataset.name}</div>
                  <div className="text-sm text-muted-foreground">{dataset.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="hidden">
            <h2 className="text-lg font-semibold mb-2">Tools</h2>
            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-2 rounded bg-card hover:bg-accent cursor-pointer"
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-muted-foreground">{tool.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default LeftSidebar