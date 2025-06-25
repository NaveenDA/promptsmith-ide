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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <div className="w-12 bg-[#1e1e1e] flex flex-col items-center py-2 border-r border-[#333333]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-none relative group",
                isActive && "bg-[#2d2d2d] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-gray-400"
              )} />
              <span className="sr-only">{item.label}</span>
              <div className="absolute left-14 px-2 py-1 bg-[#252525] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap">
                {item.label}
              </div>
            </Button>
          </Link>
        );
      })}
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-none text-gray-400 hover:text-white"
      >
        <Settings className="w-5 h-5" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>
  );
} 