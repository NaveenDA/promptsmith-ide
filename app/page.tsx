"use client";

import Header from "@/components/header";
import { ActivityBar } from "@/components/ActivityBar";
import { StatusBar } from "@/components/StatusBar";
import { CommandPalette } from "@/components/CommandPalette";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import PromptEditor from "@/components/PromptEditor";
import { TestCases } from "@/components/TestCases";
import { SecurityAnalysis } from "@/components/SecurityAnalysis";
import { History } from "@/components/History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { SELECTED_ACTIVITY_BAR_TAB } from "@/components/atoms";
import { PromptList } from "./pages/prompt-list";
import DatabaseList from "./pages/database-list";
import ToolsList from "./pages/tools-list";

export default function Home() {
	const [selectedTab] = useAtom(SELECTED_ACTIVITY_BAR_TAB);
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
							maxSize={25}
							className="bg-gray-50"
						>
							{/* Left sidebar with prompt list or database config */}
							{selectedTab === "prompts" && <PromptList />}
							{selectedTab === "database" && <DatabaseList />}
							{selectedTab === "tools" && <ToolsList />}
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={60} className="bg-white">
							{/* Main editor area */}
							<PromptEditor />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={25}
							minSize={30}
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
