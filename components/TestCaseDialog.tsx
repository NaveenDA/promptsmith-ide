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

interface TestCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (testCase: {
    name: string;
    type: "basic" | "edge" | "security";
    input: string;
    dbConfig?: {
      database: string;
      query: string;
      numResults: number;
    };
  }) => void;
  connectedDatabases?: { name: string; type: string }[];
}

export function TestCaseDialog({
  open,
  onOpenChange,
  onSave,
  connectedDatabases = [],
}: TestCaseDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"basic" | "edge" | "security">("basic");
  const [input, setInput] = useState("");
  const [useDB, setUseDB] = useState(false);
  const [selectedDB, setSelectedDB] = useState(connectedDatabases[0]?.name || "");
  const [dbQuery, setDBQuery] = useState("");
  const [numResults, setNumResults] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      input,
      dbConfig: useDB ? {
        database: selectedDB,
        query: dbQuery,
        numResults,
      } : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Add Test Case</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                      {/* Database Selection */}
                      <div className="space-y-2">
                        <Label>Database</Label>
                        <Select value={selectedDB} onValueChange={setSelectedDB}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select database" />
                          </SelectTrigger>
                          <SelectContent>
                            {connectedDatabases.map((db) => (
                              <SelectItem key={db.name} value={db.name}>
                                {db.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Results</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={numResults}
                            onChange={(e) => setNumResults(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Query</Label>
                          <Input
                            value={dbQuery}
                            onChange={(e) => setDBQuery(e.target.value)}
                            placeholder="Search terms"
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