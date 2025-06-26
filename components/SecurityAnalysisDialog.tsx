import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	Shield,
	Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";


interface AnalysisType {
	id: string;
	title: string;
	description: string;
	testCases: number;
	tokens: number;
	cost: number;
}

export const ANALYSIS_TYPES: AnalysisType[] = [
	{
		id: "instruction-override",
		title: "Instruction Override",
		description:
			"Check if the prompt can be manipulated to override its core instructions",
		testCases: 10,
		tokens: 1000,
		cost: 0.001,
	},
	{
		id: "prompt-injection",
		title: "Prompt Injection",
		description: "Analyze vulnerability to malicious prompt injection attacks",
		testCases: 12,
		tokens: 1500,
		cost: 0.0015,
	},
	{
		id: "data-extraction",
		title: "Data Extraction",
		description: "Test for potential data leakage and unauthorized data access",
		testCases: 8,
		tokens: 2000,
		cost: 0.002,
	},
	{
		id: "output-manipulation",
		title: "Output Manipulation",
		description:
			"Check if outputs can be manipulated to produce harmful content",
		testCases: 15,
		tokens: 2500,
		cost: 0.0025,
	},
];

const DEPTH_RANGES = [
	{
		min: 0,
		max: 30,
		label: "Shallow Analysis",
		description: "Quick scan of common vulnerabilities",
	},
	{
		min: 30,
		max: 60,
		label: "Medium Analysis",
		description: "Balanced depth and speed",
	},
	{
		min: 60,
		max: 80,
		label: "Deep Analysis",
		description: "Thorough security assessment",
	},
	{
		min: 80,
		max: 100,
		label: "Custom Analysis",
		description: "Configure specific test types",
	},
] as const;

interface SecurityAnalysisDialogProps {
	onAnalysisStart?: (analysis: {
		depth: number;
		selectedTypes: string[];
		useAIJudge: boolean;
		totalTests: number;
		totalCost: number;
	}) => void;
}

export function SecurityAnalysisDialog({ onAnalysisStart }: SecurityAnalysisDialogProps) {
	const [open, setOpen] = useState(false);
	const [depth, setDepth] = useState(40);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [useAIJudge, setUseAIJudge] = useState(true);



	// Calculate number of test cases based on depth
	const getTestCount = (totalTests: number) =>
		Math.ceil((totalTests * depth) / 100);

	// Calculate total test cases and cost
	const { totalTests, totalCost } = useMemo(() => {
		const isCustom = depth > 80;
		const types = isCustom ? selectedTypes : ANALYSIS_TYPES.map((t) => t.id);

		const tests = types.reduce((acc, typeId) => {
			const analysis = ANALYSIS_TYPES.find((a) => a.id === typeId);
			return acc + getTestCount(analysis?.testCases || 0);
		}, 0);

		const cost = types.reduce((acc, typeId) => {
			const analysis = ANALYSIS_TYPES.find((a) => a.id === typeId);
			return acc + (analysis?.cost || 0) * (depth / 100);
		}, 0);

		return {
			totalTests: tests,
			totalCost: cost * (useAIJudge ? 1 : 25),
		};
	}, [depth, selectedTypes, useAIJudge]);

	const handleStartAnalysis = () => {
		if (onAnalysisStart) {
			onAnalysisStart({
				depth,
				selectedTypes: depth > 80 ? selectedTypes : ANALYSIS_TYPES.map(t => t.id),
				useAIJudge,
				totalTests,
				totalCost
			});
		}
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" size="xs" className="gap-2">
					<Shield className="w-4 h-4" />
					Run Analysis
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Security Analysis</DialogTitle>
					<DialogDescription>
						Configure the depth and scope of your security analysis
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center justify-between">
					<Label className="text-base">Analysis Depth</Label>
				</div>

				<div className="space-y-6 py-4">
					{/* Analysis Depth */}
					<div className="space-y-4">
						<div className="relative pt-6">
							<Slider
								value={[depth]}
								min={0}
								max={100}
								step={5}
								onValueChange={([value]) => setDepth(value)}
								className="z-10"
							/>
							{/* Depth Range Indicators */}
							<div className="absolute left-0 right-0 top-0 flex text-xs text-gray-500">
								{DEPTH_RANGES.map((range, i) => (
									<motion.div
										key={range.label}
										className="relative"
										style={{
											width: `${range.max - range.min}%`,
										}}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: i * 0.1 }}
									>
										<div className="absolute -top-6 whitespace-nowrap">
											{range.label}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</div>

					{/* Custom Test Selection - Only shown when depth > 80% */}
					<AnimatePresence>
						{depth > 80 && (
							<motion.div
								className="space-y-3"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
							>
								<Label>Select Test Types</Label>
								<div className="grid grid-cols-2 gap-3">
									{ANALYSIS_TYPES.map((type, index) => (
										<motion.button
											key={type.id}
											className={cn(
												"p-3 rounded-lg border text-left transition-colors",
												"hover:bg-gray-50",
												selectedTypes.includes(type.id)
													? "border-blue-500 bg-blue-50"
													: "border-gray-200",
											)}
											onClick={() => {
												setSelectedTypes((prev) =>
													prev.includes(type.id)
														? prev.filter((id) => id !== type.id)
														: [...prev, type.id],
												);
											}}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<h3 className="font-medium">{type.title}</h3>
											<p className="text-sm text-gray-500 mt-1">
												{type.description}
											</p>
											<div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
												<span>
													{getTestCount(type.testCases)} of {type.testCases}{" "}
													tests
												</span>
												<span className="flex items-center gap-1">
													<Zap className="w-3 h-3" />~
													{Math.ceil((type.tokens * depth) / 100)} tokens
												</span>
											</div>
										</motion.button>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Judge Type */}
					<motion.div
						className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
						layout
					>
						<div className="space-y-1">
							<Label>Use AI as Judge</Label>
							<p className="text-sm text-gray-500">
								Toggle between AI and human review
							</p>
						</div>
						<Switch checked={useAIJudge} onCheckedChange={setUseAIJudge} />
					</motion.div>

					{/* Cost Estimation */}
					<motion.div
						className="flex items-center justify-between p-4 rounded-lg bg-blue-50 text-blue-900"
						layout
						animate={{ scale: [1, 1.02, 1] }}
						transition={{ duration: 0.3 }}
						key={`${totalCost}-${useAIJudge}`}
					>
						<div>
							<h3 className="font-medium">Estimated Cost</h3>
							<p className="text-sm mt-1">
								{totalTests} tests × {depth}% depth
							</p>
						</div>
						<div className="text-right">
							<div className="text-lg font-semibold">
								${totalCost.toFixed(4)}
							</div>
							<div className="text-sm">
								{useAIJudge ? "AI Review" : "Human Review"}
							</div>
						</div>
					</motion.div>

					{/* Run Button */}
					<motion.div layout transition={{ duration: 0.2 }}>
						<Button
							className="w-full gap-2"
							disabled={depth > 80 && selectedTypes.length === 0}
							onClick={handleStartAnalysis}
						>
							<Shield className="w-4 h-4" />
							Run Security Analysis ({totalTests} tests)
						</Button>
					</motion.div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
