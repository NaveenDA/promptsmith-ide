"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Database,
  FileText,
  Globe,
  History,
  type LucideIcon,
  Play,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useAtom } from "jotai";
import { SELECTED_ACTIVITY_BAR_TAB } from "./atoms";

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

export function ActivityBar() {
  const [selectedTab, setSelectedTab] = useAtom(SELECTED_ACTIVITY_BAR_TAB);
  return (
    <div className="w-12 border-r bg-gray-50/50 flex flex-col items-center py-2 gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={selectedTab === "prompts" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setSelectedTab("prompts")}
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
              variant={selectedTab === "database" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setSelectedTab("database")}
            >
              <Database className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Vector Databases</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
