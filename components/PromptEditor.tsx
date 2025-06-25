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



    </div>
  );
}
