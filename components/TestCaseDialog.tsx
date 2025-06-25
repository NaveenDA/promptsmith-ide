"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (testCase: {
    name: string;
    type: "basic" | "edge" | "security";
    input: string;
    expectedOutput?: string;
    groupName: string;
    validationMethod: "exact" | "manual" | "ai";
    validationRules?: string;
    aiValidationPrompt?: string;
  }) => void;
  groups: { name: string }[];
  initialData?: {
    name: string;
    type: "basic" | "edge" | "security";
    input: string;
    expectedOutput?: string;
    groupName: string;
    validationMethod: "exact" | "manual" | "ai";
    validationRules?: string;
    aiValidationPrompt?: string;
  };
}

export function TestCaseDialog({
  open,
  onOpenChange,
  onSave,
  groups,
  initialData,
}: TestCaseDialogProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<"basic" | "edge" | "security">(
    initialData?.type || "basic"
  );
  const [input, setInput] = useState(initialData?.input || "");
  const [expectedOutput, setExpectedOutput] = useState(initialData?.expectedOutput || "");
  const [groupName, setGroupName] = useState(initialData?.groupName || groups[0]?.name);
  const [validationMethod, setValidationMethod] = useState<"exact" | "manual" | "ai">(
    initialData?.validationMethod || "manual"
  );
  const [validationRules, setValidationRules] = useState(initialData?.validationRules || "");
  const [aiValidationPrompt, setAiValidationPrompt] = useState(initialData?.aiValidationPrompt || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      input,
      expectedOutput,
      groupName,
      validationMethod,
      validationRules,
      aiValidationPrompt,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Test Case</DialogTitle>
            <DialogDescription>
              Create a new test case to validate your prompt's behavior.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="edge">Edge Case</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                Group
              </Label>
              <Select value={groupName} onValueChange={setGroupName}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.name} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validation" className="text-right">
                Validation
              </Label>
              <Select value={validationMethod} onValueChange={(value: any) => setValidationMethod(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select validation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact Match</SelectItem>
                  <SelectItem value="manual">Manual Review</SelectItem>
                  <SelectItem value="ai">AI Validation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="input" className="text-right pt-2">
                Input
              </Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {validationMethod === "exact" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="expectedOutput" className="text-right pt-2">
                  Expected Output
                </Label>
                <Textarea
                  id="expectedOutput"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            )}
            {validationMethod === "ai" && (
              <>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="validationRules" className="text-right pt-2">
                    Validation Rules
                  </Label>
                  <Textarea
                    id="validationRules"
                    value={validationRules}
                    onChange={(e) => setValidationRules(e.target.value)}
                    className="col-span-3"
                    placeholder="Define rules for AI to validate the output (e.g., 'Must contain both positive and negative sentiments')"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="aiValidationPrompt" className="text-right pt-2">
                    AI Validation Prompt
                  </Label>
                  <Textarea
                    id="aiValidationPrompt"
                    value={aiValidationPrompt}
                    onChange={(e) => setAiValidationPrompt(e.target.value)}
                    className="col-span-3"
                    placeholder="Prompt for AI to validate the output (e.g., 'Does the output correctly identify mixed sentiments?')"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save Test Case</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 