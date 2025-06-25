"use client";

import Header from "@/components/header";
import { ActivityBar } from "@/components/ActivityBar";
import { StatusBar } from "@/components/StatusBar";
import { CommandPalette } from "@/components/CommandPalette";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import PromptEditor from "@/components/PromptEditor";
import { TestCases } from "@/components/TestCases";
import { SecurityAnalysis } from "@/components/SecurityAnalysis";
import { History } from "@/components/History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PromptList } from "@/components/PromptList";

export default function Home() {
	return (
		<>
			<CommandPalette />
			<div className="flex flex-col h-screen bg-white">
				<Header />
				<div className="flex-1 flex">
					<ActivityBar />
					<ResizablePanelGroup direction="horizontal" className="flex-1">
						<ResizablePanel
							defaultSize={15}
							minSize={10}
							maxSize={20}
							className="bg-gray-50"
						>
							{/* Left sidebar with prompt list */}
							<PromptList />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={60} className="bg-white">
							{/* Main editor area */}
							<PromptEditor />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={25}
							minSize={15}
							maxSize={30}
							className="bg-gray-50"
						>
							{/* Right sidebar with test cases, security analysis, and history */}
							<Tabs defaultValue="tests" className="h-full flex flex-col">
								<TabsList className="p-0 bg-transparent border-0 border-b rounded-none">
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
								<TabsContent value="tests" className="flex-1 p-0 m-0">
									<TestCases />
								</TabsContent>
								<TabsContent value="security" className="flex-1 p-0 m-0">
									<SecurityAnalysis />
								</TabsContent>
								<TabsContent value="history" className="flex-1 p-0 m-0">
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
