"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
	AlertCircle,
	CheckCircle2,
	ChevronRight,
	Clock,
	DollarSign,
	Hash,
	Info,
	MoreVertical,
	Play,
	Plus,
	XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TestCaseDialog } from "./TestCaseDialog";
import { Switch } from "./ui/switch";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface TestCase {
	id: string;
	name: string;
	status: "passed" | "failed" | "running" | "not-run" | "needs-review";
	type: "basic" | "edge" | "security";
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
}

interface TestGroup {
	name: string;
	description: string;
	tests: TestCase[];
}

export function TestCases() {
	const [groups, setGroups] = useState<TestGroup[]>([
		{
			name: "Basic Tests",
			description: "Basic functionality tests",
			tests: [
				{
					id: "1",
					name: "Happy Sentiment",
					status: "passed",
					type: "basic",
					input: "Hi this is naveen, and I am happy today.",
					expectedOutput: "positive, happy",
					actualOutput: "happy",
					validationMethod: "manual",
					reviewNotes: "✓ Correctly identified happy sentiment",
					latency: 1200,
					tokens: 150,
					cost: 0.002,
				},
				{
					id: "2",
					name: "Mixed Sentiment",
					status: "needs-review",
					type: "edge",
					input: "I got promoted but I have to relocate.",
					actualOutput: "mixed, positive, negative",
					validationMethod: "ai",
					validationRules:
						"Check if output contains both positive and negative aspects",
					aiValidationPrompt:
						"Does the output correctly identify mixed sentiments? The text contains both a positive event (promotion) and a potential negative aspect (relocation).",
					latency: 800,
					tokens: 100,
					cost: 0.001,
				},
			],
		},
		{
			name: "Security Tests",
			description: "Tests for security vulnerabilities",
			tests: [
				{
					id: "3",
					name: "Prompt Injection",
					status: "running",
					type: "security",
					input: "Attempt to inject malicious prompt...",
					expectedOutput: "Safe response",
					latency: 900,
					tokens: 120,
					cost: 0.0015,
					validationMethod: "manual",
				},
			],
		},
	]);

	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
		new Set(["Basic Tests"]),
	);
	const [selectedTest, setSelectedTest] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingTest, setEditingTest] = useState<
		{
			test: TestCase;
			groupName: string;
		} | null
	>(null);
	const [runDialogOpen, setRunDialogOpen] = useState(false);
	const [selectedTests, setSelectedTests] = useState<TestCase[]>([]);
	const [useAiJudge, setUseAiJudge] = useState(false);

	const toggleGroup = (groupName: string) => {
		const newExpanded = new Set(expandedGroups);
		if (newExpanded.has(groupName)) {
			newExpanded.delete(groupName);
		} else {
			newExpanded.add(groupName);
		}
		setExpandedGroups(newExpanded);
	};

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



	const handleSaveTest = (testData: {
		name: string;
		type: "basic" | "edge" | "security";
		input: string;
		expectedOutput: string;
		groupName: string;
		validationMethod: "exact" | "manual" | "ai";
		validationRules?: string;
		aiValidationPrompt?: string;
	}) => {
		const newTest: TestCase = {
			id: editingTest?.test.id || Math.random().toString(36).substring(7),
			name: testData.name,
			status: "not-run",
			type: testData.type,
			input: testData.input,
			expectedOutput: testData.expectedOutput,
			validationMethod: testData.validationMethod,
			validationRules: testData.validationRules,
			aiValidationPrompt: testData.aiValidationPrompt,
		};

		setGroups((currentGroups) => {
			if (editingTest) {
				// Editing existing test
				return currentGroups.map((group) => {
					if (group.name === editingTest.groupName) {
						return {
							...group,
							tests: group.tests.map((t) =>
								t.id === editingTest.test.id ? newTest : t
							),
						};
					}
					return group;
				});
			} else {
				// Adding new test
				return currentGroups.map((group) => {
					if (group.name === testData.groupName) {
						return {
							...group,
							tests: [...group.tests, newTest],
						};
					}
					return group;
				});
			}
		});
	};

	const handleDeleteTest = (testId: string, groupName: string) => {
		setGroups((currentGroups) =>
			currentGroups.map((group) => {
				if (group.name === groupName) {
					return {
						...group,
						tests: group.tests.filter((t) => t.id !== testId),
					};
				}
				return group;
			})
		);
		if (selectedTest === testId) {
			setSelectedTest(null);
		}
	};

	const handleDuplicateTest = (test: TestCase, groupName: string) => {
		const newTest: TestCase = {
			...test,
			id: Math.random().toString(36).substring(7),
			name: `${test.name} (Copy)`,
			status: "not-run",
		};

		setGroups((currentGroups) =>
			currentGroups.map((group) => {
				if (group.name === groupName) {
					return {
						...group,
						tests: [...group.tests, newTest],
					};
				}
				return group;
			})
		);
	};

	// Calculate total and AI validation costs for selected tests
	const calculateCosts = () => {
		const costs = {
			totalExecutionCost: 0,
			totalAiValidationCost: 0,
		};

		selectedTests.forEach((test) => {
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
		});

		return costs;
	};

	const handleRunSelectedTests = () => {
		const selectedTestIds = new Set(selectedTests.map((t) => t.id));
		setRunDialogOpen(false);

		// Run each test
		groups.forEach((group) => {
			group.tests.forEach((test) => {
				if (selectedTestIds.has(test.id)) {
					handleRunTest(test);
				}
			});
		});
	};

	const handleRunTest = async (test: TestCase) => {
		// Update test status to running
		setGroups((currentGroups) =>
			currentGroups.map((group) => ({
				...group,
				tests: group.tests.map((t) =>
					t.id === test.id ? { ...t, status: "running" } : t
				),
			}))
		);

		// TODO: Actual test execution logic here
		const result = {
			output: "happy, positive",
			latency: 950,
			tokens: 120,
			cost: 0.0015,
		};

		// If using AI judge and test method isn't exact, validate the output
		let status: TestCase["status"] = "needs-review";
		let reviewNotes: string | undefined;
		let additionalCost = 0;

		if (test.validationMethod === "exact") {
			status = test.expectedOutput === result.output
				? "passed"
				: "failed";
		} else if (useAiJudge) {
			// TODO: Implement AI validation
			const aiValidationPrompt = `
You are a test validator for a prompt engineering IDE.
Your task is to validate if the output matches the expected behavior.

Test Case: ${test.name}
Input: ${test.input}
Actual Output: ${result.output}

Validation Rules:
${test.validationRules}

${test.aiValidationPrompt}

Please respond with either "PASS" or "FAIL" followed by a brief explanation.
Keep the explanation under 100 characters.
`;

			// Simulate AI validation for now
			status = Math.random() > 0.5 ? "passed" : "failed";
			reviewNotes = status === "passed"
				? "✓ AI Judge: Output correctly identifies the sentiment"
				: "✗ AI Judge: Output missing key sentiment aspects";

			// Calculate AI validation cost
			const promptTokens = aiValidationPrompt.length / 4;
			const outputTokens = 50;
			additionalCost = ((promptTokens + outputTokens) / 1000) * 0.0015;
		}

		setGroups((currentGroups) =>
			currentGroups.map((group) => ({
				...group,
				tests: group.tests.map((t) =>
					t.id === test.id
						? {
							...t,
							actualOutput: result.output,
							latency: result.latency,
							tokens: result.tokens,
							cost: (result.cost || 0) + additionalCost,
							status,
							reviewNotes,
						}
						: t
				),
			}))
		);
	};

	const handleValidateOutput = (
		test: TestCase,
		isValid: boolean,
		notes?: string,
	) => {
		setGroups((currentGroups) =>
			currentGroups.map((group) => ({
				...group,
				tests: group.tests.map((t) =>
					t.id === test.id
						? {
							...t,
							status: isValid ? "passed" : "failed",
							reviewNotes: notes || t.reviewNotes,
						}
						: t
				),
			}))
		);
	};

	return (
		<div className="h-full flex flex-col">
			<div className="flex items-center justify-between px-4 py-2 border-b">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold">Test Cases</h2>
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="xs"
						variant="outline"
						className="text-xs"
						onClick={() => {
							setEditingTest(null);
							setDialogOpen(true);
						}}
					>
						<Plus className="w-4 h-4" />
						Add Test
					</Button>
					<Button
						size="xs"
						variant="outline"
						className="text-xs"
						onClick={() => {
							setSelectedTests(
								groups.flatMap((g) =>
									g.tests.filter((t) =>
										t.status !== "running"
									)
								),
							);
							setRunDialogOpen(true);
						}}
					>
						<Play className="w-4 h-4" />
						Run All
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-auto">
				{groups.map((group) => (
					<div key={group.name} className="border-b last:border-b-0">
						<div
							className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 cursor-pointer select-none"
							onClick={() =>
								toggleGroup(group.name)}
						>
							<ChevronRight
								className={cn(
									"h-4 w-4 text-gray-500 transition-transform",
									expandedGroups.has(group.name) &&
										"rotate-90",
								)}
							/>
							<span className="text-sm font-medium">
								{group.name}
							</span>
							<Badge variant="outline" className="text-xs">
								{group.tests.length}
							</Badge>
						</div>

						{expandedGroups.has(group.name) && (
							<div className="py-1">
								{group.tests.map((test) => (
									<div
										key={test.id}
										className={cn(
											"group px-8 py-2 hover:bg-gray-50 cursor-pointer border-l-2",
											selectedTest === test.id
												? "bg-gray-50 border-l-blue-500"
												: "border-l-transparent",
										)}
										onClick={() => setSelectedTest(test.id)}
									>
										<div className="flex items-center gap-2 mb-1">
											{getStatusIcon(test.status)}
											<span className="text-sm font-medium">
												{test.name}
											</span>
											{test.status === "needs-review" &&
												test.validationMethod ===
													"manual" &&
												(
													<div className="flex items-center gap-1">
														<Button
															size="sm"
															variant="outline"
															className="h-6 text-xs text-green-600 hover:text-green-700"
															onClick={(e) => {
																e.stopPropagation();
																handleValidateOutput(
																	test,
																	true,
																	"Manually approved",
																);
															}}
														>
															Approve
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="h-6 text-xs text-red-600 hover:text-red-700"
															onClick={(e) => {
																e.stopPropagation();
																handleValidateOutput(
																	test,
																	false,
																	"Manually rejected",
																);
															}}
														>
															Reject
														</Button>
													</div>
												)}
											<div className="flex-1" />
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 opacity-0 group-hover:opacity-100"
												onClick={(e) => {
													e.stopPropagation();
													handleRunTest(test);
												}}
											>
												<Play className="h-4 w-4" />
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 opacity-0 group-hover:opacity-100"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem>
														Duplicate
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-red-600">
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>

										<div className="pl-6 space-y-1">
											{test.actualOutput && (
												<div className="text-xs">
													<span className="text-gray-500">
														Output:
													</span>
													<span className="font-mono">
														{test.actualOutput}
													</span>
												</div>
											)}
											{test.reviewNotes && (
												<div className="flex items-center gap-1 text-xs text-gray-600">
													<Info className="h-3 w-3" />
													{test.reviewNotes}
												</div>
											)}
											{test.status !== "not-run" && (
												<div className="flex items-center gap-3 text-xs text-gray-500">
													<div className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{test.latency}ms
													</div>
													<div className="flex items-center gap-1">
														<Hash className="h-3 w-3" />
														{test.tokens} tokens
													</div>
													<div className="flex items-center gap-1">
														<DollarSign className="h-3 w-3" />$
														{test.cost?.toFixed(4)}
													</div>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				))}
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
				onSave={handleSaveTest as (testCase: {
					name: string;
					type: "basic" | "edge" | "security";
					input: string;
					expectedOutput?: string;
					groupName: string;
					validationMethod: "manual" | "exact" | "ai";
					validationRules?: string;
					aiValidationPrompt?: string;
				}) => void}
				groups={groups}
				initialData={editingTest
					? {
						name: editingTest.test.name,
						type: editingTest.test.type,
						input: editingTest.test.input,
						expectedOutput: editingTest.test.expectedOutput,
						groupName: editingTest.groupName,
						validationMethod: editingTest.test.validationMethod,
						validationRules: editingTest.test.validationRules,
						aiValidationPrompt: editingTest.test.aiValidationPrompt,
					}
					: undefined}
			/>
		</div>
	);
}
