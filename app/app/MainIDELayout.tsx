"use client";

import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import PromptEditor from "./core/prompts/prompt-editor";
import { TestCases } from "./core/testcases/testcases-list";
import { SecurityAnalysis } from "./core/security/security-analysis-list";
import { History } from "./core/history/history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedActivityBarTabAtom, selectedPromptIdAtom } from "@/lib/store";
import { PromptList } from "./core/prompts/prompt-list";
import DatabaseList from "./core/databases/database-list";
import ToolsList from "./core/tools/tools-list";
import { ActivityBar } from "@/components/activity-bar";
import SwitchCase, { Case } from "@/components/ui/switch-case";
import { useRef, useEffect } from "react";

type PromptEditorHandle = { savePrompt: () => void };
type PromptListHandle = {
	createNewPrompt: () => void;
	isPromptListLoading?: boolean;
	isPromptListEmpty?: boolean;
};
type DatabaseListHandle = { createNewDatabase: () => void };

export default function MainIDELayout() {
	const [selectedTab] = useAtom(selectedActivityBarTabAtom);
	const [selectedPromptId] = useAtom(selectedPromptIdAtom);

	const promptEditorRef = useRef<PromptEditorHandle>(null);
	const promptListRef = useRef<PromptListHandle>(null);
	const databaseListRef = useRef<DatabaseListHandle>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
			const isSave =
				(isMac && e.metaKey && e.key === "s") ||
				(!isMac && e.ctrlKey && e.key === "s");
			const isNew =
				(isMac && e.metaKey && e.key === "n") ||
				(!isMac && e.ctrlKey && e.key === "n");
			if (selectedTab === "prompts") {
				if (isSave) {
					e.preventDefault();
					if (
						promptEditorRef.current &&
						typeof promptEditorRef.current?.savePrompt === "function"
					) {
						promptEditorRef.current.savePrompt();
					}
				}
				if (isNew) {
					e.preventDefault();
					if (
						promptListRef.current &&
						typeof promptListRef.current.createNewPrompt === "function"
					) {
						promptListRef.current.createNewPrompt();
					}
				}
			}
			if (selectedTab === "database") {
				if (isNew) {
					e.preventDefault();
					if (
						databaseListRef.current &&
						typeof databaseListRef.current.createNewDatabase === "function"
					) {
						databaseListRef.current.createNewDatabase();
					}
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedTab]);

	return (
		<>
			<CommandPalette />
			<div className="flex flex-col h-screen bg-white">
				<div className="flex-1 flex">
					<ActivityBar />
					<ResizablePanelGroup direction="horizontal" className="flex-1">
						<ResizablePanel
							defaultSize={20}
							minSize={20}
							maxSize={20}
							className="bg-gray-50"
						>
							{/* Left sidebar with prompt list or database config */}
							<SwitchCase value={selectedTab}>
								<Case value="prompts">
									<PromptList
										ref={promptListRef}
										activePromptId={selectedPromptId}
									/>
								</Case>
								<Case value="database">
									<DatabaseList ref={databaseListRef} />
								</Case>
								<Case value="tools">
									<ToolsList />
								</Case>
							</SwitchCase>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel defaultSize={50} className="bg-white">
							{/* Main editor area */}
							<PromptEditor
								ref={promptEditorRef}
								selectedPromptId={selectedPromptId}
								onCreatePrompt={() => promptListRef.current?.createNewPrompt()}
							/>
						</ResizablePanel>
						<ResizableHandle />
						{selectedPromptId && (
							<ResizablePanel
								defaultSize={30}
								minSize={25}
								maxSize={30}
								className="bg-gray-50"
							>
								{/* Right sidebar with test cases, security analysis, and history */}
								<Tabs defaultValue="tests" className="h-full flex flex-col">
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
									<TabsContent value="tests" className="flex-1 p-0 m-0">
										<TestCases />
									</TabsContent>
									<TabsContent value="security" className="flex-1 p-0 m-0">
										<SecurityAnalysis />
									</TabsContent>
									<TabsContent value="history" className="flex-1 p-0 m-0">
										{selectedPromptId && (
											<History promptId={selectedPromptId} />
										)}
									</TabsContent>
								</Tabs>
							</ResizablePanel>
						)}
					</ResizablePanelGroup>
				</div>
				<StatusBar />
			</div>
		</>
	);
}
