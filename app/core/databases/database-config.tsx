import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import {
	ExternalLink,
	Info,
	Lock,
	ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface VectorDB {
	id: string;
	name: string;
	type:
		| "pinecone"
		| "qdrant"
		| "weaviate"
		| "milvus"
		| "cassandra"
		| "clickhouse"
		| "mongodb"
		| "redis";
	icon: string;
	connectionString: string;
	indexName: string;
	status: "connected" | "disconnected" | "error";
	documentCount?: number;
}

interface DatabaseType {
	id: string;
	name: string;
	description: string;
	image: string;
	docsUrl: string;
	connectionGuide: string;
}

const DATABASE_OPTIONS: Omit<
	VectorDB,
	"id" | "status" | "connectionString" | "indexName" | "documentCount"
>[] = [
	{
		name: "Apache Cassandra",
		type: "cassandra",
		icon: "/db-icons/cassandra.svg",
	},
	{ name: "ClickHouse", type: "clickhouse", icon: "/db-icons/clickhouse.svg" },
	{ name: "MongoDB", type: "mongodb", icon: "/db-icons/mongodb.svg" },
	{ name: "Redis", type: "redis", icon: "/db-icons/redis.svg" },
	{ name: "Pinecone", type: "pinecone", icon: "/db-icons/pinecone.svg" },
	{ name: "Qdrant", type: "qdrant", icon: "/db-icons/qdrant.svg" },
	{ name: "Weaviate", type: "weaviate", icon: "/db-icons/weaviate.svg" },
	{ name: "Milvus", type: "milvus", icon: "/db-icons/milvus.svg" },
];

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

interface DatabaseConfigProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DatabaseConfig({ open, onOpenChange }: DatabaseConfigProps) {
	const [databases, setDatabases] = useState<VectorDB[]>([]);
	const [selectedType, setSelectedType] = useState<DatabaseType | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		connectionUrl: "",
		apiKey: "",
	});

	const handleAddDatabase = (db: Omit<VectorDB, "id" | "status">) => {
		setDatabases([
			...databases,
			{
				...db,
				id: Math.random().toString(36).substr(2, 9),
				status: "disconnected",
			},
		]);
		onOpenChange(false);
	};

	const handleTestConnection = async (db: VectorDB) => {
		// TODO: Implement actual connection test
		setDatabases(
			databases.map((d) =>
				d.id === db.id ? { ...d, status: "connected", documentCount: 1234 } : d,
			),
		);
	};

	const handleBack = () => {
		setSelectedType(null);
		setFormData({
			name: "",
			connectionUrl: "",
			apiKey: "",
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Handle form submission
		console.log("Form submitted:", { type: selectedType, ...formData });
		onOpenChange(false);
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
					<form onSubmit={handleSubmit} className="py-4 space-y-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Database Name</Label>
								<Input
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Enter a name for this database"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label>Connection URL</Label>
									<a
										href={selectedType.connectionGuide}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-blue-500 hover:text-blue-700"
									>
										How to get connection URL?
									</a>
								</div>
								<div className="relative">
									<Input
										type="password"
										value={formData.connectionUrl}
										onChange={(e) =>
											setFormData({
												...formData,
												connectionUrl: e.target.value,
											})
										}
										placeholder="Enter connection URL"
									/>
									<Tooltip>
										<TooltipTrigger asChild>
											<Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
										</TooltipTrigger>
										<TooltipContent>
											Connection details are encrypted at rest
										</TooltipContent>
									</Tooltip>
								</div>
							</div>

							{selectedType.id === "pinecone" && (
								<div className="space-y-2">
									<Label>API Key</Label>
									<div className="relative">
										<Input
											type="password"
											value={formData.apiKey}
											onChange={(e) =>
												setFormData({ ...formData, apiKey: e.target.value })
											}
											placeholder="Enter API key"
										/>
										<Tooltip>
											<TooltipTrigger asChild>
												<Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
											</TooltipTrigger>
											<TooltipContent>
												API keys are encrypted at rest
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							)}

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

						<div className="flex justify-end gap-2 pt-4">
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit">Add Database</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
