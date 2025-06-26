"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Beaker, Bug, Shield, X, Info } from "lucide-react";
import Image from "next/image";

interface TestCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (testCase: {
    name: string;
    type: "basic" | "edge" | "security";
    input: string;
    expectedOutput?: string;
    groupName: string;
    validationMethod: "manual" | "exact" | "ai";
    validationRules?: string;
    aiValidationPrompt?: string;
  }) => void;
  groups: { name: string; description: string }[];
  initialData?: {
    name: string;
    type: "basic" | "edge" | "security";
    input: string;
    expectedOutput?: string;
    groupName: string;
    validationMethod: "manual" | "exact" | "ai";
    validationRules?: string;
    aiValidationPrompt?: string;
  };
}

const textEmbeddingModels = [
  {
      provider: "OpenAI",
      name: "text-embedding-3-small",
      description: "Fast and efficient embeddings",
  },
  {
      provider: "OpenAI",
      name: "text-embedding-3-large",
      description: "High-quality embeddings",
  },
  {
      provider: "Cohere",
      name: "embed-multilingual-v3.0",
      description: "Multilingual support",
  },
  {
      provider: "Mistral",
      name: "bge-base-en-v1.5",
      description: "Balanced performance",
  },
  {
      provider: "Google",
      name: "textembedding-gecko",
      description: "Production-ready embeddings",
  }
];

export function TestCaseDialog({
  open,
  onOpenChange,
  onSave,
  groups,
  initialData,
}: TestCaseDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"basic" | "edge" | "security">("basic");
  const [input, setInput] = useState("");
  const [useDB, setUseDB] = useState(false);
  const [selectedDB, setSelectedDB] = useState(groups[0]?.name || "");
  const [dbQuery, setDBQuery] = useState("");
  const [numResults, setNumResults] = useState(3);
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-small");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      input,
      expectedOutput: initialData?.expectedOutput,
      groupName: initialData?.groupName || "",
      validationMethod: initialData?.validationMethod || "manual",
      validationRules: initialData?.validationRules,
      aiValidationPrompt: initialData?.aiValidationPrompt,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Test Case</DialogTitle>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter test case name"
                required
              />
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === "basic" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setType("basic")}
                >
                  <Beaker className="h-4 w-4" />
                  Basic
                </Button>
                <Button
                  type="button"
                  variant={type === "edge" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setType("edge")}
                >
                  <Bug className="h-4 w-4" />
                  Edge
                </Button>
                <Button
                  type="button"
                  variant={type === "security" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setType("security")}
                >
                  <Shield className="h-4 w-4" />
                  Security
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Label>Input</Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your prompt"
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Database Switch */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" onClick={() => setUseDB(!useDB)}>Use Database</Label>
                <Switch
                  checked={useDB}
                  onCheckedChange={setUseDB}
                />
              </div>

              {useDB && (
                <>
                  {/* Info Message */}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Info className="h-4 w-4 mt-0.5" />
                    <p>Use <code className="bg-muted px-1 py-0.5 rounded">$db_results</code> in your prompt where you want to include the database results</p>
                  </div>

                  {/* Database Configuration */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Database Selection */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Database</Label>
                          <Select value={selectedDB} onValueChange={setSelectedDB}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select database" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map((group) => (
                                <SelectItem key={group.name} value={group.name} className="py-2.5">
                                  <div className="flex items-center gap-2">
                                    <Image 
                                      src={`/db-icons/${group.name.toLowerCase()}.svg`} 
                                      alt={group.name} 
                                      width={16} 
                                      height={16} 
                                      className="object-contain"
                                    />
                                    <span className="font-medium">{group.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Embedding Model */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Embedding Model</Label>
                          <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
                            <SelectTrigger className="h-9">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <Image 
                                    src={`/logos/${textEmbeddingModels.find(m => m.name === embeddingModel)?.provider.toLowerCase()}.svg`} 
                                    alt={embeddingModel} 
                                    width={14} 
                                    height={14} 
                                    className="object-contain"
                                  />
                                  <span className="truncate">{embeddingModel}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {textEmbeddingModels.map((model) => (
                                <SelectItem key={model.name} value={model.name} className="py-2.5">
                                  <div className="flex items-center gap-2">
                                    <Image 
                                      src={`/logos/${model.provider.toLowerCase()}.svg`} 
                                      alt={model.provider} 
                                      width={16} 
                                      height={16} 
                                      className="object-contain"
                                    />
                                    <div>
                                      <div className="font-medium">{model.name}</div>
                                      <div className="text-xs text-gray-500">{model.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Results</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={numResults}
                            onChange={(e) => setNumResults(Number(e.target.value))}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Query</Label>
                          <Input
                            value={dbQuery}
                            onChange={(e) => setDBQuery(e.target.value)}
                            placeholder="Search terms"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            className="w-full"
            type="submit"
            onClick={handleSubmit}
          >
            Save Test Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 