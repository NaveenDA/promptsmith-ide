"use client";

import Header from "@/components/header";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import PromptEditor from "./core/prompts/prompt-editor";
import { TestCases } from "./core/testcases/testcases-list";
import { SecurityAnalysis } from "@/app/core/security/security-analysis-list";
import { History } from "@/app/core/history/history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedActivityBarTabAtom } from "@/lib/store";
import { PromptList } from "@/app/core/prompts/prompt-list";
import DatabaseList from "@/app/core/databases/database-list";
import ToolsList from "@/app/core/tools/tools-list";
import { ActivityBar } from "@/components/activity-bar";
import SwitchCase, { Case } from "@/components/ui/switch-case";
import MainIDELayout from "./MainIDELayout";

export default function Home() {
	return <MainIDELayout />;
}
