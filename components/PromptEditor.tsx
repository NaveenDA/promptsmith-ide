"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Play,
  Save,
  Shield,
  Settings,
  Variable,
  FileJson,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface Variable {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  required: boolean;
}

interface PromptVersion {
  id: string;
  content: string;
  variables: Variable[];
  createdAt: Date;
  model: string;
  temperature: number;
}

export default function PromptEditor() {
  const [title, setTitle] = useState("Extract Model Names");
  const [content, setContent] = useState(`Your task is to extract model names from machine learning paper abstracts. Your response is an array of the model names in the format [\\\"model_name\\\"]. If you don't find model names in the abstract or you are not sure, return [\\\"NA\\\"]\n\nAbstract: Large Language Models (LLMs), such as ChatGPT and GPT-4, have revolutionized natural language processing research and demonstrated potential in Artificial General Intelligence (AGI). However, the expensive training and deployment of LLMs present challenges to transparent and open academic research. To address these issues, this project open-sources the Chinese LLaMA and Alpaca…`);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [activeTab, setActiveTab] = useState("edit");
  const [model, setModel] = useState({
    provider: "OpenAI",
    name: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
  });

  return (
    <div className="h-full flex flex-col">
      {/* Title and Model Info Bar */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-0 px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700"
            placeholder="Enter prompt title..."

          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-600">
              {model.provider}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {model.name}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              temp: {model.temperature}
            </Badge>
            <Button variant="ghost" size="sm" className="gap-1">
              <Settings className="w-3 h-3" />
              Configure
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield className="w-4 h-4" />
              Security Check
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Run
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b bg-gray-50">
          <TabsList className="p-0 bg-transparent border-0">
            <TabsTrigger
              value="edit"
              className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="variables"
              className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Variables
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 p-0 m-0">
          <div className="relative h-full">
            <div className="absolute inset-0 p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-none text-gray-700 font-mono"
                placeholder="Enter your prompt here..."
                
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-4 m-0 bg-white">
          <div className="prose max-w-none">
            {/* Rendered preview with variables replaced */}
            {content}
          </div>
        </TabsContent>

        <TabsContent value="variables" className="flex-1 p-4 m-0 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Variables</h3>
              <Button variant="outline" size="sm">
                Add Variable
              </Button>
            </div>
            {variables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p>No variables defined yet.</p>
                <p className="text-sm">
                  Variables help make your prompts more dynamic and reusable.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {variables.map((variable) => (
                  <div
                    key={variable.name}
                    className="p-3 rounded bg-gray-50 border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-700">
                        {variable.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {variable.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {variable.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
