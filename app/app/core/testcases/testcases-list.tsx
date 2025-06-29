"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { selectedPromptIdAtom } from "@/lib/store";
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Clock,
	Info,
	MoreVertical,
	Play,
	Plus,
	ThumbsDown,
	ThumbsUp,
	XCircle,
	Edit,
	Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TestCaseDialog } from "./testcases-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import TitleBar from "@/components/ui/title-bar";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface TestCase {
	id: string;
	name: string;
	status: "passed" | "failed" | "running" | "not-run" | "needs-review";
	type: "basic" | "edge" | "security";
	category: "basic" | "edge" | "security";
	input: string;
	expectedOutput?: string;
	actualOutput?: string;
	latency?: number;
	tokens?: number;
	cost?: number;
	error?: string;
	validationMethod: "exact" | "manual" | "ai";
	validationRules?: string;
	aiValidationPrompt?: string;
	reviewNotes?: string;
	promptId: string;
	userId: string;
	useDatabase?: boolean;
	databaseId?: string;
	embeddingModel?: string;
	numResults?: number;
	similarityThreshold?: number;
	executedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	aiFeedback?: string;
}

interface TestCaseFormData {
	name: string;
	input: string;
	expectedOutput?: string;
	categoryName: string;
	validationMethod: "exact" | "manual" | "ai";
	validationRules?: string;
	aiValidationPrompt?: string;
}

interface TestCategory {
	id: string;
	name: string;
	description: string;
	tests: TestCase[];
}

// Fixed categories
const CATEGORIES = [
	{
		id: "basic",
		name: "Basic Tests",
		description: "Basic functionality tests",
	},
	{
		id: "edge",
		name: "Edge Cases",
		description: "Edge case and boundary tests",
	},
	{
		id: "security",
		name: "Security Tests",
		description: "Security and safety tests",
	},
];

export function TestCases() {
	const promptId = useAtomValue(selectedPromptIdAtom);
	const queryClient = useQueryClient();

	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set(["basic"]),
	);
	const [selectedTest, setSelectedTest] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingTest, setEditingTest] = useState<
		{
			test: TestCase;
			categoryName: string;
		} | null
	>(null);
	const [runDialogOpen, setRunDialogOpen] = useState(false);
	const [selectedTests, setSelectedTests] = useState<TestCase[]>([]);
	const [useAiJudge, setUseAiJudge] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [qaDialogOpen, setQaDialogOpen] = useState(false);
	const [qaTest, setQaTest] = useState<TestCase | null>(null);

	// Query for fetching test cases
	const {
		data: testCases = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["testcases", promptId],
		queryFn: async () => {
			if (!promptId) return [];
			const response = await fetch(`/api/prompts/${promptId}/testcases`);
			if (!response.ok) {
				throw new Error("Failed to fetch test cases");
			}
			return response.json() as Promise<TestCase[]>;
		},
		enabled: !!promptId,
	});

	// Group test cases by category
	const categories: TestCategory[] = CATEGORIES.map((category) => ({
		...category,
		tests: testCases.filter((test: TestCase) =>
			test.category === category.id
		),
	}));

	// Mutation for creating test cases
	const createTestCaseMutation = useMutation({
		mutationFn: async (data: TestCaseFormData & { categoryId: string }) => {
			const response = await fetch(`/api/prompts/${promptId}/testcases`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: data.categoryId,
					name: data.name,
					input: data.input,
					expectedOutput: data.expectedOutput,
					validationMethod: data.validationMethod,
					validationRules: data.validationRules,
					aiValidationPrompt: data.aiValidationPrompt,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to create test case");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["testcases", promptId],
			});
			toast.success("Test case created successfully");
		},
		onError: () => {
			toast.error("Failed to create test case");
		},
	});

	// Mutation for updating test cases
	const updateTestCaseMutation = useMutation({
		mutationFn: async ({
			id,
			data,
		}: { id: string; data: TestCaseFormData & { categoryId: string } }) => {
			const response = await fetch(`/api/testcases/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: data.categoryId,
					name: data.name,
					input: data.input,
					expectedOutput: data.expectedOutput,
					validationMethod: data.validationMethod,
					validationRules: data.validationRules,
					aiValidationPrompt: data.aiValidationPrompt,
					status: "not-run",
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to update test case");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["testcases", promptId],
			});
			toast.success("Test case updated successfully");
		},
		onError: () => {
			toast.error("Failed to update test case");
		},
	});

	// Mutation for deleting test cases
	const deleteTestCaseMutation = useMutation({
		mutationFn: async (testId: string) => {
			const response = await fetch(
				`/api/prompts/${promptId}/testcases/${testId}`,
				{
					method: "DELETE",
				},
			);
			if (!response.ok) {
				throw new Error("Failed to delete test case");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["testcases", promptId],
			});
			toast.success("Test case deleted successfully");
			if (
				selectedTest &&
				deleteTestCaseMutation.variables === selectedTest
			) {
				setSelectedTest(null);
			}
		},
		onError: () => {
			toast.error("Failed to delete test case");
		},
	});

	// Mutation for duplicating test cases
	const duplicateTestCaseMutation = useMutation({
		mutationFn: async ({
			test,
			categoryId,
		}: { test: TestCase; categoryId: string }) => {
			const response = await fetch(`/api/prompts/${promptId}/testcases`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: categoryId,
					name: `${test.name} (Copy)`,
					type: test.type,
					input: test.input,
					expectedOutput: test.expectedOutput,
					validationMethod: test.validationMethod,
					validationRules: test.validationRules,
					aiValidationPrompt: test.aiValidationPrompt,
					useDatabase: test.useDatabase,
					databaseId: test.databaseId,
					embeddingModel: test.embeddingModel,
					numResults: test.numResults,
					similarityThreshold: test.similarityThreshold,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to duplicate test case");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["testcases", promptId],
			});
			toast.success("Test case duplicated successfully");
		},
		onError: () => {
			toast.error("Failed to duplicate test case");
		},
	});

	const getStatusIcon = (status: TestCase["status"]) => {
		switch (status) {
			case "passed":
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case "failed":
				return <XCircle className="h-4 w-4 text-red-500" />;
			case "running":
				return (
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
				);
			case "needs-review":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			default:
				return <Clock className="h-4 w-4 text-gray-400" />;
		}
	};

	const handleSaveTest = async (testData: TestCaseFormData) => {
		const categoryId = testData.categoryName
			.toLowerCase()
			.replace(" cases", "")
			.replace(" tests", "")
			.replace(" ", "");

		if (editingTest) {
			await updateTestCaseMutation.mutateAsync({
				id: editingTest.test.id,
				data: { ...testData, categoryId },
			});
		} else {
			await createTestCaseMutation.mutateAsync({
				...testData,
				categoryId,
			});
		}
		setEditingTest(null);
	};

	const handleDeleteTest = async (testId: string) => {
		await deleteTestCaseMutation.mutateAsync(testId);
	};

	const handleDuplicateTest = async (
		test: TestCase,
		categoryName: string,
	) => {
		const categoryId = categoryName
			.toLowerCase()
			.replace(" cases", "")
			.replace(" tests", "")
			.replace(" ", "");
		await duplicateTestCaseMutation.mutateAsync({ test, categoryId });
	};

	// Calculate total and AI validation costs for selected tests
	const calculateCosts = () => {
		const costs = {
			totalExecutionCost: 0,
			totalAiValidationCost: 0,
		};
		for (const test of selectedTests) {
			// Base execution cost (assuming average token usage)
			const executionTokens = test.input.length / 4 + 50; // Input tokens + average output tokens
			costs.totalExecutionCost += (executionTokens / 1000) * 0.0015;

			// AI validation cost if applicable
			if (test.validationMethod !== "exact" && useAiJudge) {
				const validationTokens = ((test.validationRules?.length || 0) +
					(test.aiValidationPrompt?.length || 0) +
					test.input.length +
					200) / // Buffer for validation response
					4;
				costs.totalAiValidationCost += (validationTokens / 1000) *
					0.0015;
			}
		}

		return costs;
	};

	const handleRunSelectedTests = () => {
		const selectedTestIds = new Set(selectedTests.map((t) => t.id));
		setRunDialogOpen(false);

		// Run each test
		for (const category of categories) {
			for (const test of category.tests) {
				if (selectedTestIds.has(test.id)) {
					handleRunTest(test);
				}
			}
		}
	};

	const handleRunTest = async (test: TestCase) => {
		// TODO: Implement actual test execution logic
		// Mock test execution - you would replace this with actual API calls
		console.log("Running test:", test.name);
	};

	const handleValidateOutput = (
		test: TestCase,
		isValid: boolean,
		notes?: string,
	) => {
		// TODO: Implement output validation mutation
		console.log("Validating output:", test.name, isValid, notes);
	};

	const handleApprove = (test: TestCase) => {
		handleValidateOutput(test, true, "Approved by user");
		setQaDialogOpen(false);
	};

	const handleDisapprove = (test: TestCase) => {
		handleValidateOutput(test, false, "Disapproved by user");
		setQaDialogOpen(false);
	};

	if (!promptId) {
		return (
			<div className="flex h-full items-center justify-center text-gray-500">
				Select a prompt to view test cases
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center text-red-500">
				Error loading test cases: {error.message}
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<TitleBar
				title="Test Cases"
				extra={
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="text-xs hover:bg-gray-100"
									onClick={() => {
										setEditingTest(null);
										setDialogOpen(true);
									}}
									disabled={!promptId ||
										categories.length === 0}
								>
									<Plus className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Add Test</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="text-xs hover:bg-gray-100"
									onClick={() => {
										setSelectedTests(
											categories.flatMap((c) =>
												c.tests.filter((t) =>
													t.status !== "running"
												)
											),
										);
										setRunDialogOpen(true);
									}}
								>
									<Play className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Run All Tests</p>
							</TooltipContent>
						</Tooltip>
						{/* Expand / Collapse all */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="text-xs hover:bg-gray-100"
									onClick={() => {
										if (!isExpanded) {
											setExpandedCategories(
												new Set(
													categories.map((c) => c.id),
												),
											);
											setIsExpanded(true);
										} else {
											setExpandedCategories(new Set());
											setIsExpanded(false);
										}
									}}
								>
									{isExpanded
										? <ChevronDown className="w-4 h-4" />
										: <ChevronUp className="w-4 h-4" />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{isExpanded ? "Collapse all" : "Expand all"}
							</TooltipContent>
						</Tooltip>
					</div>
				}
			/>
			<div className="">
				{!promptId && (
					<div className="text-center text-muted-foreground py-8">
						No prompt selected. Please select a prompt to view test
						cases.
					</div>
				)}

				{isLoading && (
					<div className="text-center text-muted-foreground py-8">
						Loading test cases...
					</div>
				)}

				{!isLoading && promptId && categories.length === 0 && (
					<div className="text-center text-muted-foreground py-8">
						No test cases found. Create test cases to get started.
					</div>
				)}

				{!isLoading && promptId && categories.length > 0 && (
					<Accordion
						type="multiple"
						className="w-full"
						value={Array.from(expandedCategories)}
						onValueChange={(values) =>
							setExpandedCategories(new Set(values))}
					>
						{categories.map((category) => (
							<AccordionItem
								value={category.id}
								key={category.id}
							>
								<AccordionTrigger className="h-10 hover:border-none pl-3">
									<div className="flex items-center gap-2">
										<span>{category.name}</span>
										<Badge
											variant="outline"
											className="text-xs "
										>
											{category?.tests?.length ?? 0}
										</Badge>
									</div>
								</AccordionTrigger>
								<AccordionContent className="">
									{category.tests.map((test) => {
										return (
											<div
												key={test.id}
												className={cn(
													"border-b group relative cursor-pointer transition bg-white p-2",
													category.tests.indexOf(
															test,
														) ===
															category.tests
																	.length - 1
														? "border-b-0"
														: "border-b",
												)}
												onClick={() => {
													setQaTest(test);
													setQaDialogOpen(true);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setQaTest(test);
														setQaDialogOpen(true);
													}
												}}
											>
												{/* Status Icon */}
												<p className="flex items-center">
													{getStatusIcon(test.status)}
													{" "}
													&nbsp;{" "}
													<span className="text-sm ">
														{test.name}
													</span>
												</p>
												{test.actualOutput && (
													<p className="text-xs text-gray-500 w-2/3 break-words whitespace-pre-wrap truncate">
														Output:{" "}
														{test.actualOutput}
													</p>
												)}
												<div className="flex gap-2 opacity-50">
													<p className="text-[8px] text-gray-500">
														Cost: ${test.cost}
													</p>
													<p className="text-[8px] text-gray-500">
														Latency:{" "}
														{test.latency}ms
													</p>
												</div>
												{/* Dropdown menu for actions */}
												<div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
													<DropdownMenu>
														<DropdownMenuTrigger
															asChild
														>
															<Button
																size="icon"
																variant="ghost"
																onClick={(e) =>
																	e.stopPropagation()}
																title="Actions"
															>
																<MoreVertical className="w-4 h-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleRunTest(
																		test,
																	);
																}}
															>
																Re-run
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	setEditingTest(
																		{
																			test,
																			categoryName:
																				category
																					.name,
																		},
																	);
																	setDialogOpen(
																		true,
																	);
																}}
															>
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleDuplicateTest(
																		test,
																		category
																			.name,
																	);
																}}
															>
																Duplicate
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																variant="destructive"
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	e.preventDefault();
																}}
															>
																<AlertDialog>
																	<AlertDialogTrigger
																		asChild
																	>
																		<button
																			className="block"
																			type="button"
																			onClick={(
																				e,
																			) => e
																				.stopPropagation()}
																		>
																			Delete
																		</button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>
																				Are
																				you
																				absolutely
																				sure?
																			</AlertDialogTitle>
																			<AlertDialogDescription>
																				This
																				action
																				cannot
																				be
																				undone.
																				This
																				will
																				permanently
																				delete
																				this
																				test
																				case
																				and
																				remove
																				its
																				data.
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>
																				Cancel
																			</AlertDialogCancel>
																			<AlertDialogAction
																				onClick={() => {
																					handleDeleteTest(
																						test.id,
																					);
																				}}
																			>
																				Delete
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
												{/* Approve/Disapprove always visible at bottom right, small */}
												<div className=" flex gap-1">
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																size="xs"
																variant="ghost"
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleApprove(
																		test,
																	);
																}}
																title="Approve"
																className="scale-75"
															>
																<ThumbsUp className="w-3 h-3 text-green-500" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Approve</p>
														</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																size="xs"
																variant="ghost"
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	handleDisapprove(
																		test,
																	);
																}}
																title="Disapprove"
																className="scale-75"
															>
																<ThumbsDown className="w-3 h-3 text-red-500" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Disapprove</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</div>
										);
									})}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				)}
			</div>

			<Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Run Tests</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<div className="flex items-center gap-4 mb-4">
							<div className="flex-1">
								<h3 className="text-sm font-medium mb-1">
									Selected Tests
								</h3>
								<p className="text-sm text-gray-500">
									{selectedTests.length} test
									{selectedTests.length !== 1 ? "s" : ""}{" "}
									selected
								</p>
							</div>
							{selectedTests.some((t) =>
								t.validationMethod !== "exact"
							) && (
								<div className="flex items-center gap-2">
									<Switch
										id="aiJudge"
										checked={useAiJudge}
										onCheckedChange={setUseAiJudge}
									/>
									<div className="flex items-center gap-1">
										<Label
											htmlFor="aiJudge"
											className="text-sm"
										>
											Use AI Judge
										</Label>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-4 w-4 text-gray-400" />
												</TooltipTrigger>
												<TooltipContent>
													<p>
														AI will automatically
														validate test outputs
														using GPT-3.5-turbo
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</div>
							)}
						</div>

						<div className="space-y-3 mb-4">
							<div className="flex justify-between text-sm">
								<span>Execution Cost</span>
								<span>
									${calculateCosts().totalExecutionCost
										.toFixed(4)}
								</span>
							</div>
							{useAiJudge && (
								<div className="flex justify-between text-sm">
									<span>AI Validation Cost</span>
									<span>
										${calculateCosts().totalAiValidationCost
											.toFixed(4)}
									</span>
								</div>
							)}
							<div className="flex justify-between text-sm font-medium pt-2 border-t">
								<span>Total Cost</span>
								<span>
									$
									{(
										calculateCosts().totalExecutionCost +
										calculateCosts().totalAiValidationCost
									).toFixed(4)}
								</span>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setRunDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleRunSelectedTests}>
							Run {selectedTests.length} Test
							{selectedTests.length !== 1 ? "s" : ""}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<TestCaseDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSave={handleSaveTest}
				categories={categories}
				initialData={editingTest
					? {
						name: editingTest.test.name,
						input: editingTest.test.input,
						expectedOutput: editingTest.test.expectedOutput,
						categoryName: editingTest.categoryName,
						validationMethod: editingTest.test.validationMethod,
						validationRules: editingTest.test.validationRules,
						aiValidationPrompt: editingTest.test.aiValidationPrompt,
						useDatabase: editingTest.test.useDatabase,
						databaseId: editingTest.test.databaseId,
						embeddingModel: editingTest.test.embeddingModel,
						numResults: editingTest.test.numResults,
						similarityThreshold:
							editingTest.test.similarityThreshold,
					}
					: undefined}
			/>

			{/* Q&A Dialog */}
			<Dialog open={qaDialogOpen} onOpenChange={setQaDialogOpen}>
				<DialogContent className="min-w-[80vw] h-[75vh] max-h-[75vh] flex flex-col">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<DialogTitle>Test Case Details</DialogTitle>
							{qaTest && (
								<div className="flex items-center gap-2">
									<Badge variant={qaTest.status === "passed" ? "secondary" : qaTest.status === "failed" ? "destructive" : "default"}>{qaTest.status}</Badge>
									<Button size="sm" variant="secondary" onClick={() => handleRunTest(qaTest)}><Play className="w-4 h-4 mr-1" /> Run Again</Button>
								</div>
							)}
						</div>
					</DialogHeader>
					{qaTest && (
						<>
							{/* Metadata Section */}
							<div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div className="space-y-1">
									<div><span className="font-semibold">Validation:</span> {qaTest.validationMethod}</div>
									<div><span className="font-semibold">Model:</span> {qaTest.embeddingModel}</div>
									{qaTest.useDatabase && qaTest.databaseId && (
										<div><span className="font-semibold">Database:</span> {qaTest.databaseId} <span className="text-muted-foreground">({qaTest.embeddingModel})</span></div>
									)}
									<div>
										<span className="font-semibold">Executed:</span>{" "}
										{qaTest.executedAt
											? (typeof qaTest.executedAt === "string" || typeof qaTest.executedAt === "number")
												? new Date(qaTest.executedAt).toLocaleString()
												: qaTest.executedAt instanceof Date
													? qaTest.executedAt.toLocaleString()
													: "-"
											: "-"}
									</div>
									{/* Expected Output */}
									<div>
										<span className="font-semibold">Expected Output:</span>
										<div className="bg-gray-50 rounded p-2 mt-1 whitespace-pre-line">{qaTest.expectedOutput ?? "N/A"}</div>
									</div>
								</div>
								<div className="space-y-1">
									<div><span className="font-semibold">Latency:</span> {qaTest.latency} ms</div>
									<div><span className="font-semibold">Tokens:</span> {qaTest.tokens}</div>
									<div><span className="font-semibold">Cost:</span> ${qaTest.cost?.toFixed(4)}</div>
									<div>
										<span className="font-semibold">AI Feedback:</span>
										<div className="bg-gray-50 rounded p-2 mt-1 whitespace-pre-line">{qaTest.aiFeedback}</div>
									</div>
								</div>
							</div>
							{/* Input/Output Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 flex-1 overflow-y-auto">
								<div className="space-y-2 h-full">
									<p className="font-semibold text-sm text-gray-700">Input</p>
									<pre className="bg-gray-100 rounded p-2 text-xs font-mono whitespace-pre-wrap h-64 md:h-full max-h-full overflow-auto">
										{qaTest.input}
									</pre>
								</div>
								<div className="space-y-2 h-full">
									<p className="font-semibold text-sm text-gray-700">Response</p>
									<pre className="bg-gray-100 rounded p-2 text-xs font-mono whitespace-pre-wrap break-words h-64 md:h-full max-h-full overflow-auto">
										{qaTest.actualOutput || "-"}
									</pre>
								</div>
							</div>
						</>
					)}
					<DialogFooter className="mt-4 flex gap-2">
						{qaTest && <>
							<Button variant="outline" onClick={() => handleApprove(qaTest)}><ThumbsUp className="w-4 h-4 mr-1 text-green-500" /> Approve</Button>
							<Button variant="destructive" onClick={() => handleDisapprove(qaTest)}><ThumbsDown className="w-4 h-4 mr-1" /> Disapprove</Button>
						</>}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
