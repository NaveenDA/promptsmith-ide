"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  FileText,
  Database,
  Settings,
  Play,
  History,
  Shield,
  type LucideIcon,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ActivityBarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const items: ActivityBarItem[] = [
  {
    icon: FileText,
    label: "Prompts",
    href: "/prompts",
  },
  {
    icon: Database,
    label: "Datasets",
    href: "/datasets",
  },
  {
    icon: Play,
    label: "Test Cases",
    href: "/test-cases",
  },
  {
    icon: Shield,
    label: "Security",
    href: "/security",
  },
  {
    icon: History,
    label: "History",
    href: "/history",
  },
];

interface ActivityBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  return (
    <div className="w-12 border-r bg-gray-50/50 flex flex-col items-center py-2 gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTab === "prompts" ? "secondary" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => onTabChange("prompts")}
            >
              <FileText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Prompts</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTab === "database" ? "secondary" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => onTabChange("database")}
            >
              <Database className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Vector Databases</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTab === "api" ? "secondary" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => onTabChange("api")}
            >
              <Globe className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>API Keys</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => onTabChange("settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 