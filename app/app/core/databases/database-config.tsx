import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRef, useState } from "react";
import { ExternalLink, Info, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DatabaseType {
	id: string;
	name: string;
	description: string;
	image: string;
	docsUrl: string;
	connectionGuide: string;
}

const DATABASE_TYPES: DatabaseType[] = [
	{
		id: "chroma",
		name: "Chroma",
		description: "Open-source embedding database",
		image: "/logos/chroma.webp",
		docsUrl: "https://docs.trychroma.com/getting-started",
		connectionGuide:
			"https://docs.trychroma.com/usage-guide#using-chromadb-persistently",
	},
	{
		id: "pinecone",
		name: "Pinecone",
		description: "Managed vector database",
		image: "/logos/pinecone.png",
		docsUrl: "https://docs.pinecone.io/docs/overview",
		connectionGuide: "https://docs.pinecone.io/docs/authentication",
	},
	{
		id: "pgvector",
		name: "pgvector",
		description: "PostgreSQL vector extension",
		image: "/logos/pg-vector.png",
		docsUrl: "https://github.com/pgvector/pgvector",
		connectionGuide:
			"https://supabase.com/docs/guides/database/extensions/pgvector",
	},
	{
		id: "qdrant",
		name: "Qdrant",
		description: "Vector database for AI apps",
		image: "/logos/qdrant.png",
		docsUrl: "https://qdrant.tech/documentation/",
		connectionGuide: "https://qdrant.tech/documentation/quick-start/",
	},
	{
		id: "weaviate",
		name: "Weaviate",
		description: "Open-source vector search engine",
		image: "/logos/weaviate.png",
		docsUrl: "https://weaviate.io/developers/weaviate",
		connectionGuide: "https://weaviate.io/developers/weaviate/installation",
	},
	{
		id: "milvus",
		name: "Milvus",
		description: "Vector database built for AI",
		image: "/logos/milvus.png",
		docsUrl: "https://milvus.io/docs",
		connectionGuide: "https://milvus.io/docs/install_standalone-docker.md",
	},
];

// Add a config object for required fields per database type
const DATABASE_FIELDS: Record<
	string,
	Array<{
		key: string;
		label: string;
		placeholder?: string;
		type?: string;
		optional?: boolean;
	}>
> = {
	pinecone: [
		{
			key: "apiKey",
			label: "Pinecone API Key",
			placeholder: "Enter Pinecone API key",
			type: "password",
		},
		{
			key: "collectionName",
			label: "Collection Name",
			placeholder: "Enter collection name",
		},
	],
	chroma: [
		{ key: "url", label: "Chroma URL", placeholder: "Enter Chroma URL" },
		{
			key: "collectionName",
			label: "Collection Name",
			placeholder: "Enter collection name",
		},
	],
	pgvector: [
		{ key: "user", label: "User", placeholder: "Enter database user" },
		{ key: "host", label: "Host", placeholder: "Enter host" },
		{
			key: "database",
			label: "Database Name",
			placeholder: "Enter database name",
		},
		{
			key: "password",
			label: "Password",
			placeholder: "Enter password",
			type: "password",
		},
		{ key: "port", label: "Port", placeholder: "5432", type: "number" },
	],
	qdrant: [
		{ key: "url", label: "Qdrant URL", placeholder: "Enter Qdrant URL" },
		{
			key: "apiKey",
			label: "Qdrant API Key",
			placeholder: "Enter Qdrant API key",
			type: "password",
			optional: true,
		},
		{
			key: "collectionName",
			label: "Collection Name",
			placeholder: "Enter collection name",
		},
	],
	weaviate: [
		{
			key: "url",
			label: "Weaviate URL",
			placeholder: "Enter Weaviate instance URL",
		},
		{
			key: "apiKey",
			label: "Weaviate API Key",
			placeholder: "Enter Weaviate API key",
			type: "password",
		},
		{
			key: "collectionName",
			label: "Collection Name",
			placeholder: "Enter collection name",
		},
	],
	milvus: [
		{ key: "url", label: "Milvus URL", placeholder: "Enter Milvus URL" },
		{
			key: "collectionName",
			label: "Collection Name",
			placeholder: "Enter collection name",
		},
	],
};

// Zod schemas for each database type
const DATABASE_SCHEMAS: Record<string, z.AnyZodObject> = {
	pinecone: z.object({
		apiKey: z.string().min(1, { message: "API Key is required" }),
		collectionName: z
			.string()
			.min(1, { message: "Collection name is required" }),
	}),
	chroma: z.object({
		url: z.string().url({ message: "Valid URL required" }),
		collectionName: z
			.string()
			.min(1, { message: "Collection name is required" }),
	}),
	pgvector: z.object({
		user: z.string().min(1, { message: "User is required" }),
		host: z.string().min(1, { message: "Host is required" }),
		database: z.string().min(1, { message: "Database name is required" }),
		password: z.string().min(1, { message: "Password is required" }),
		port: z.coerce.number().min(1, { message: "Port is required" }),
	}),
	qdrant: z.object({
		url: z.string().url({ message: "Valid URL required" }),
		apiKey: z.string().optional(),
		collectionName: z
			.string()
			.min(1, { message: "Collection name is required" }),
	}),
	weaviate: z.object({
		url: z.string().url({ message: "Valid URL required" }),
		apiKey: z.string().min(1, { message: "API Key is required" }),
		collectionName: z
			.string()
			.min(1, { message: "Collection name is required" }),
	}),
	milvus: z.object({
		url: z.string().url({ message: "Valid URL required" }),
		collectionName: z
			.string()
			.min(1, { message: "Collection name is required" }),
	}),
};

interface DatabaseConfigProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DatabaseConfig({ open, onOpenChange }: DatabaseConfigProps) {
	const [selectedType, setSelectedType] = useState<DatabaseType | null>(null);
	const addDatabaseButtonRef = useRef<HTMLButtonElement>(null);
	const queryClient = useQueryClient();
	const schema = selectedType ? DATABASE_SCHEMAS[selectedType.id] : null;
	const form = useForm({
		resolver: schema ? zodResolver(schema) : undefined,
		defaultValues: { name: "" },
	});

	type FormValues = typeof schema extends z.ZodTypeAny
		? z.infer<typeof schema>
		: Record<string, unknown>;

	const saveDatabaseMutation = useMutation({
		mutationFn: async (
			data: FormValues & { type: string; description?: string },
		) => {
			const response = await fetch("/api/databases", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to save database config");
			}

			return response.json();
		},
		onSuccess: () => {
			toast.success("Database configuration saved successfully!");
			queryClient.invalidateQueries({ queryKey: ["databases"] });
			onOpenChange(false);
			setSelectedType(null);
			form.reset({ name: "" });
		},
		onError: (error) => {
			console.error("Error saving database config:", error);
			toast.error("Failed to save database configuration");
		},
	});

	const handleBack = () => {
		setSelectedType(null);
		form.reset({ name: "" });
	};

	const handleSubmit = async (values: FormValues) => {
		console.log("values", values);
		saveDatabaseMutation.mutate({
			...values,
			type: selectedType?.id || "",
			description: selectedType?.description,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<div className="flex items-center gap-2">
						{selectedType && (
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 -ml-2"
								onClick={handleBack}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
						)}
						<div>
							<DialogTitle>
								{selectedType
									? `Configure ${selectedType.name}`
									: "Add Database"}
							</DialogTitle>
							<DialogDescription>
								{selectedType
									? "Configure your database connection"
									: "Select a vector database to connect"}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				{!selectedType ? (
					<div className="grid grid-cols-3 gap-3 py-4">
						{DATABASE_TYPES.map((type) => (
							<button
								type="button"
								key={type.id}
								className={cn(
									"flex flex-col items-center gap-2 p-4 rounded-lg border",
									"hover:border-blue-200 hover:bg-blue-50/50",
									"transition-colors duration-150",
									"group relative",
								)}
								onClick={() => setSelectedType(type)}
							>
								<Image
									src={type.image}
									alt={type.name}
									width={40}
									height={40}
									className="object-contain"
								/>
								<div className="text-center">
									<div className="font-medium text-sm">{type.name}</div>
									<div className="text-xs text-gray-500">
										{type.description}
									</div>
								</div>
								<a
									href={type.docsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={(e) => e.stopPropagation()}
								>
									<ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
								</a>
							</button>
						))}
					</div>
				) : (
					<Form {...form}>
						<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="py-4 space-y-4"
							onError={(e) => {
								console.error("Error submitting form:", e);
							}}
						>
							<div className="space-y-4">
								{DATABASE_FIELDS[selectedType.id]?.map((field) => (
									<FormField
										key={field.key}
										control={form.control}
										name={field.key}
										render={({ field: rhfField }) => (
											<FormItem>
												<FormLabel>
													{field.label}
													{field.optional ? " (optional)" : ""}
												</FormLabel>
												<FormControl>
													<Input
														type={field.type || "text"}
														placeholder={field.placeholder}
														{...rhfField}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}

								<div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
									<Info className="h-4 w-4 mt-0.5" />
									<div>
										Your connection details are encrypted using AES-256 before
										being stored.{" "}
										<a
											href="/docs/security"
											className="underline hover:text-blue-900"
										>
											Learn more about our security practices
										</a>
									</div>
								</div>
							</div>
							<Button
								type="submit"
								// className="hidden"
								ref={addDatabaseButtonRef}
							>
								Add Database
							</Button>
						</form>
					</Form>
				)}

				<div className="flex justify-end gap-2 pt-4">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						type="button"
						disabled={saveDatabaseMutation.isPending}
						onClick={() => addDatabaseButtonRef.current?.click()}
					>
						{saveDatabaseMutation.isPending ? "Adding..." : "Add Database"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
