"use client";

import { useState } from "react";
import { Plus, File, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface Prompt {
  id: string;
  name: string;
  lastModified: Date;
}

export function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: "1", name: "Customer Support Assistant", lastModified: new Date() },
    { id: "2", name: "Code Review Helper", lastModified: new Date() },
    { id: "3", name: "Product Description Generator", lastModified: new Date() },
  ]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleNewPrompt = () => {
    const newPrompt: Prompt = {
      id: Math.random().toString(36).substring(7),
      name: "New Prompt",
      lastModified: new Date(),
    };
    setPrompts([...prompts, newPrompt]);
    setSelectedPrompt(newPrompt.id);
    setIsRenaming(newPrompt.id);
  };

  const handleRename = (promptId: string) => {
    setIsRenaming(promptId);
    setNewName(prompts.find(p => p.id === promptId)?.name || "");
  };

  const handleRenameSubmit = (promptId: string) => {
    if (newName.trim()) {
      setPrompts(prompts.map(p => 
        p.id === promptId ? { ...p, name: newName.trim() } : p
      ));
    }
    setIsRenaming(null);
    setNewName("");
  };

  const handleDelete = (promptId: string) => {
    setPrompts(prompts.filter(p => p.id !== promptId));
    if (selectedPrompt === promptId) {
      setSelectedPrompt(null);
    }
  };

  const handleDuplicate = (prompt: Prompt) => {
    const newPrompt: Prompt = {
      id: Math.random().toString(36).substring(7),
      name: `${prompt.name} (Copy)`,
      lastModified: new Date(),
    };
    setPrompts([...prompts, newPrompt]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Prompts</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleNewPrompt}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className={cn(
              "group flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 cursor-pointer",
              selectedPrompt === prompt.id && "bg-gray-100"
            )}
            onClick={() => setSelectedPrompt(prompt.id)}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {isRenaming === prompt.id ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleRenameSubmit(prompt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit(prompt.id);
                    }
                  }}
                  className="h-6 text-xs"
                  autoFocus
                />
              ) : (
                <span className="text-sm truncate">{prompt.name}</span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleRename(prompt.id)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicate(prompt)}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDelete(prompt.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
} 