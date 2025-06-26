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
import { selectedActivityBarTabAtom, selectedPromptIdAtom } from "@/lib/store";
import { PromptList } from "@/app/core/prompts/prompt-list";
import DatabaseList from "@/app/core/databases/database-list";
import ToolsList from "@/app/core/tools/tools-list";
import { ActivityBar } from "@/components/activity-bar";
import SwitchCase, { Case } from "@/components/ui/switch-case";

export default function MainIDELayout() {
	const [selectedTab] = useAtom(selectedActivityBarTabAtom);
	const [selectedPromptId] = useAtom(selectedPromptIdAtom);
	return (
		<>
			<CommandPalette />
			<div className="flex flex-col h-screen bg-white">
				<Header />
				<div className="flex-1 flex">
					<ActivityBar />
					<ResizablePanelGroup
						direction="horizontal"
						className="flex-1"
					>
						<ResizablePanel
							defaultSize={20}
							minSize={20}
							maxSize={20}
							className="bg-gray-50"
						>
							{/* Left sidebar with prompt list or database config */}
							<SwitchCase value={selectedTab}>
								<Case value="prompts">
									<PromptList />
								</Case>
								<Case value="database">
									<DatabaseList />
								</Case>
								<Case value="tools">
									<ToolsList />
								</Case>
							</SwitchCase>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50} className="bg-white">
							{/* Main editor area */}
							<PromptEditor selectedPromptId={selectedPromptId} />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={30}
							minSize={25}
							maxSize={30}
							className="bg-gray-50"
						>
							{/* Right sidebar with test cases, security analysis, and history */}
							<Tabs
								defaultValue="tests"
								className="h-full flex flex-col"
							>
								<div className=" border-b rounded-none w-full">
									<TabsList className="p-0 bg-transparent border-0">
										<TabsTrigger
											value="tests"
											className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
										>
											Test Cases
										</TabsTrigger>
										<TabsTrigger
											value="security"
											className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
										>
											Security
										</TabsTrigger>
										<TabsTrigger
											value="history"
											className="rounded-none border-0 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
										>
											History
										</TabsTrigger>
									</TabsList>
								</div>
								<TabsContent
									value="tests"
									className="flex-1 p-0 m-0"
								>
									<TestCases />
								</TabsContent>
								<TabsContent
									value="security"
									className="flex-1 p-0 m-0"
								>
									<SecurityAnalysis />
								</TabsContent>
								<TabsContent
									value="history"
									className="flex-1 p-0 m-0"
								>
									<History />
								</TabsContent>
							</Tabs>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
				<StatusBar />
			</div>
		</>
	);
} 