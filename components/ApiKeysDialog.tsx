"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Eye, EyeOff, Key } from "lucide-react";
import Image from "next/image";

interface ApiKeyConfig {
  id: string;
  name: string;
  key: string;
  docLink: string;
  getKeyLink: string;
}

const API_PROVIDERS: ApiKeyConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    
    key: "",
    docLink: "https://platform.openai.com/docs/api-reference",
    getKeyLink: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    key: "",
    docLink: "https://docs.anthropic.com/claude/reference",
    getKeyLink: "https://console.anthropic.com/account/keys",
  },
  {
    id: "cohere",
    name: "Cohere",
    key: "",
    docLink: "https://docs.cohere.com/reference",
    getKeyLink: "https://dashboard.cohere.com/api-keys",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    key: "",
    docLink: "https://docs.mistral.ai/api",
    getKeyLink: "https://console.mistral.ai/api-keys",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    key: "",
    docLink: "https://docs.perplexity.ai",
    getKeyLink: "https://www.perplexity.ai/settings/api",
  },
  // deepseek r1
  {
    id: "deepseek",
    name: "DeepSeek",
    key: "",
    docLink: "https://api-docs.deepseek.com",
    getKeyLink: "https://platform.deepseek.com/api_keys",
  },
];

export function ApiKeysDialog() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const savedKeys = localStorage.getItem("api_keys");
      return savedKeys ? JSON.parse(savedKeys) : {};
    }
    return {};
  });
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const handleKeyChange = (providerId: string, value: string) => {
    const newKeys = { ...apiKeys, [providerId]: value };
    setApiKeys(newKeys);
    localStorage.setItem("api_keys", JSON.stringify(newKeys));
  };

  const toggleKeyVisibility = (providerId: string) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Key className="w-4 h-4" />
          API Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Keys Management</DialogTitle>
          <DialogDescription>
            For maximum security, API keys are stored locally in your browser.
            They won't get synced to other browsers or devices.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {API_PROVIDERS.map((provider) => (
            <div key={provider.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src={`/logos/${provider.id}.svg`} alt={provider.name} width={20} height={20} />
                  <span className="font-medium">{provider.name}</span>
                  <a
                    href={provider.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <a
                  href={provider.getKeyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Get Key
                </a>
              </div>
              <div className="flex gap-2">
                <Input
                  type={showKeys[provider.id] ? "text" : "password"}
                  placeholder={`Enter ${provider.name} API key`}
                  value={apiKeys[provider.id] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeyChange(provider.id, e.target.value)}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleKeyVisibility(provider.id)}
                >
                  {showKeys[provider.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 