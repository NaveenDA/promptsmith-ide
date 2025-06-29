"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

// Zod schema for form validation
const testCaseFormSchema = z
	.object({
		name: z
			.string()
			.min(1, "Name is required")
			.min(2, "Name must be at least 2 characters"),
		input: z
			.string()
			.min(1, "Input is required")
			.min(10, "Input must be at least 10 characters"),
		expectedOutput: z.string().optional(),
		categoryName: z.string().min(1, "Category is required"),
		validationMethod: z.enum(["manual", "exact", "ai"], {
			required_error: "Please select a validation method",
		}),
		validationRules: z.string().optional(),
		aiValidationPrompt: z.string().optional(),
		useDatabase: z.boolean(),
		databaseId: z.string().optional(),
		embeddingModel: z.string().optional(),
		numResults: z.number().min(1).max(10).optional(),
		similarityThreshold: z.number().min(0).max(1).optional(),
	})
	.refine(
		(data) => {
			// If validation method is AI, validation rules and prompt are required
			if (data.validationMethod === "ai") {
				return (
					data.validationRules &&
					data.validationRules.length > 0 &&
					data.aiValidationPrompt &&
					data.aiValidationPrompt.length > 0
				);
			}
			return true;
		},
		{
			message:
				"Validation rules and AI validation prompt are required when using AI validation",
			path: ["validationRules"],
		},
	)
	.refine(
		(data) => {
			// If using database, database ID and embedding model are required
			if (data.useDatabase) {
				return data.databaseId && data.embeddingModel;
			}
			return true;
		},
		{
			message: "Database and embedding model are required when using database",
			path: ["databaseId"],
		},
	);

type TestCaseFormData = z.infer<typeof testCaseFormSchema>;

interface TestCaseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (testCase: TestCaseFormData) => void;
	categories: { id: string; name: string; description: string }[];
	initialData?: Partial<TestCaseFormData>;
}

const sample_databases = [
	{
		id: "website-index",
		name: "Website Index",
		type: "chroma",
		description: "Semantic search index for website content and documentation",
		documentCount: 15234,
		lastUpdated: "2024-03-15",
		status: "active",
	},
	{
		id: "product-index",
		name: "Product Index",
		type: "chroma",
		description: "Product catalog with semantic search capabilities",
		documentCount: 8756,
		lastUpdated: "2024-03-14",
		status: "indexing",
	},
	{
		id: "customer-support",
		name: "Customer Support",
		type: "pinecone",
		description: "Support tickets and knowledge base articles",
		documentCount: 25689,
		lastUpdated: "2024-03-13",
		status: "active",
	},
	{
		id: "scientific-research",
		name: "Scientific Research",
		type: "pgvector",
		description: "Research papers and academic publications",
		documentCount: 42156,
		lastUpdated: "2024-03-12",
		status: "active",
	},
	{
		id: "financial-data",
		name: "Financial Data",
		type: "qdrant",
		description: "Financial reports and market analysis",
		documentCount: 12567,
		lastUpdated: "2024-03-10",
		status: "error",
	},
	{
		id: "product-index-long",
		name: "Product Index A very long name that should be truncated",
		type: "chroma",
		description: "Product catalog with semantic search capabilities",
		documentCount: 8756,
		lastUpdated: "2024-03-14",
		status: "indexing",
	},
];

const dbtype_images = {
	chroma: "/logos/chroma.webp",
	faiss: "/logos/meta.png",
	pinecone: "/logos/pinecone.png",
	pgvector: "/logos/pg-vector.png",
	qdrant: "/logos/qdrant.png",
	weaviate: "/logos/weaviate.png",
	milvus: "/logos/milvus.png",
} as const;

const textEmbeddingModels = [
	{
		provider: "OpenAI",
		name: "text-embedding-3-small",
		description: "Fast and efficient embeddings",
	},
	{
		provider: "OpenAI",
		name: "text-embedding-3-large",
		description: "High-quality embeddings",
	},
	{
		provider: "Cohere",
		name: "embed-multilingual-v3.0",
		description: "Multilingual support",
	},
	{
		provider: "Mistral",
		name: "bge-base-en-v1.5",
		description: "Balanced performance",
	},
	{
		provider: "Google",
		name: "textembedding-gecko",
		description: "Production-ready embeddings",
	},
];

export function TestCaseDialog({
	open,
	onOpenChange,
	onSave,
	categories,
	initialData,
}: TestCaseDialogProps) {
	const form = useForm<TestCaseFormData>({
		resolver: zodResolver(testCaseFormSchema),
		defaultValues: {
			name: "",
			input: "",
			expectedOutput: "",
			categoryName: categories[0]?.name || "",
			validationMethod: "manual",
			validationRules: "",
			aiValidationPrompt: "",
			useDatabase: false,
			databaseId: sample_databases[0]?.id || "",
			embeddingModel: "text-embedding-3-small",
			numResults: 3,
			similarityThreshold: 0.5,
		},
	});

	const { watch, reset } = form;
	const validationMethod = watch("validationMethod");
	const useDatabase = watch("useDatabase");

	// Reset form when dialog opens/closes or initialData changes
	useEffect(() => {
		if (open) {
			reset({
				name: initialData?.name || "",
				input: initialData?.input || "",
				expectedOutput: initialData?.expectedOutput || "",
				categoryName: initialData?.categoryName || categories[0]?.name || "",
				validationMethod: initialData?.validationMethod || "manual",
				validationRules: initialData?.validationRules || "",
				aiValidationPrompt: initialData?.aiValidationPrompt || "",
				useDatabase: initialData?.useDatabase || false,
				databaseId: initialData?.databaseId || sample_databases[0]?.id || "",
				embeddingModel: initialData?.embeddingModel || "text-embedding-3-small",
				numResults: initialData?.numResults || 3,
				similarityThreshold: initialData?.similarityThreshold || 0.5,
			});
		}
	}, [open, initialData, categories, reset]);

	const onSubmit = (data: TestCaseFormData) => {
		onSave(data);
		onOpenChange(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] p-0 gap-0 max-h-[90vh] overflow-y-auto">
				<div className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl">
							{initialData ? "Edit Test Case" : "Add Test Case"}
						</DialogTitle>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Name */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter test case name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Category Selection */}
							<FormField
								control={form.control}
								name="categoryName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<div className="flex gap-2">
												{categories.map((category) => (
													<Button
														key={category.id}
														type="button"
														variant={
															field.value === category.name
																? "default"
																: "outline"
														}
														className="flex-1 gap-2"
														onClick={() => field.onChange(category.name)}
													>
														{category.name}
													</Button>
												))}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Input */}
							<FormField
								control={form.control}
								name="input"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Input</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter your prompt"
												className="min-h-[120px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Expected Output */}
							<FormField
								control={form.control}
								name="expectedOutput"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Expected Output (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter expected output"
												className="min-h-[80px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Validation Method */}
							<FormField
								control={form.control}
								name="validationMethod"
								render={({ field }) => (
									<FormItem className="hidden">
										<FormLabel>Validation Method</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || "manual"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="manual">Manual Review</SelectItem>
												<SelectItem value="exact">Exact Match</SelectItem>
												<SelectItem value="ai">AI Validation</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* AI Validation Fields */}
							{validationMethod === "ai" && (
								<>
									<FormField
										control={form.control}
										name="validationRules"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Validation Rules</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter validation rules"
														className="min-h-[60px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="aiValidationPrompt"
										render={({ field }) => (
											<FormItem>
												<FormLabel>AI Validation Prompt</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter AI validation prompt"
														className="min-h-[60px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{/* Database Toggle */}
							<FormField
								control={form.control}
								name="useDatabase"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between">
											<FormLabel>Use Database</FormLabel>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Database Configuration */}
							{useDatabase && (
								<div className="space-y-4">
									{/* Info Message */}
									<div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
										<Info className="h-4 w-4 mt-0.5" />
										<p>
											Use{" "}
											<code className="bg-muted px-1 py-0.5 rounded">
												$db_results
											</code>{" "}
											in your prompt where you want to include the database
											results
										</p>
									</div>

									{/* Database Selection */}
									<FormField
										control={form.control}
										name="databaseId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Database</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value || ""}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select database" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{sample_databases.map((db) => (
															<SelectItem key={db.id} value={db.id}>
																<div className="flex items-center gap-2">
																	<Image
																		src={
																			dbtype_images[
																				db.type as keyof typeof dbtype_images
																			]
																		}
																		alt={db.name}
																		width={16}
																		height={16}
																		className="object-contain"
																	/>
																	<span className="font-medium truncate">
																		{db.name}
																	</span>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Embedding Model */}
									<FormField
										control={form.control}
										name="embeddingModel"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Embedding Model</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value || ""}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue>
																{field.value && (
																	<div className="flex items-center gap-2">
																		<Image
																			src={`/logos/${textEmbeddingModels
																				.find((m) => m.name === field.value)
																				?.provider.toLowerCase()}.svg`}
																			alt={field.value}
																			width={14}
																			height={14}
																			className="object-contain"
																		/>
																		<span className="truncate">
																			{field.value}
																		</span>
																	</div>
																)}
															</SelectValue>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{textEmbeddingModels.map((model) => (
															<SelectItem key={model.name} value={model.name}>
																<div className="flex items-center gap-2">
																	<Image
																		src={`/logos/${model.provider.toLowerCase()}.svg`}
																		alt={model.provider}
																		width={16}
																		height={16}
																		className="object-contain"
																	/>
																	<div>
																		<div className="font-medium">
																			{model.name}
																		</div>
																		<div className="text-xs text-gray-500">
																			{model.description}
																		</div>
																	</div>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-2 gap-4">
										{/* Number of Results */}
										<FormField
											control={form.control}
											name="numResults"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Results</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															max={10}
															{...field}
															onChange={(e) =>
																field.onChange(Number(e.target.value))
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Similarity Threshold */}
										<FormField
											control={form.control}
											name="similarityThreshold"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Similarity Threshold ({field.value ?? 0.5})
													</FormLabel>
													<FormControl>
														<Slider
															min={0}
															max={1}
															step={0.01}
															value={[field.value ?? 0.5]}
															onValueChange={(value) =>
																field.onChange(value[0])
															}
															className="w-full"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							<DialogFooter className="pt-6">
								<Button type="submit" className="w-full">
									{initialData ? "Update Test Case" : "Save Test Case"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
