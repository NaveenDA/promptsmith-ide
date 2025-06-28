import { Button } from "@/components/ui/button";
import { Plus, Search, Settings2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { useState, forwardRef, useImperativeHandle } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { DatabaseConfig } from "./database-config";
import TitleBar from "@/components/ui/title-bar";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const dbtype_images = {
	chroma: "/logos/chroma.webp",
	faiss: "/logos/meta.png",
	pinecone: "/logos/pinecone.png",
	pgvector: "/logos/pg-vector.png",
	qdrant: "/logos/qdrant.png",
	weaviate: "/logos/weaviate.png",
	milvus: "/logos/milvus.png",
} as const;

interface VectorDatabase {
	id: string;
	name: string;
	type: keyof typeof dbtype_images;
	description: string;
	collectionName: string;
	status: "active" | "indexing" | "error";
	documentCount: number;
	lastConnected: string | null;
	createdAt: string;
}

const DatabaseList = forwardRef(function DatabaseList(_props, ref) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDb, setSelectedDb] = useState<string | null>(null);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const queryClient = useQueryClient();

	const { data: databases = [], isLoading: loading } = useQuery<
		VectorDatabase[]
	>({
		queryKey: ["databases"],
		queryFn: async () => {
			const response = await fetch("/api/databases");
			if (!response.ok) {
				throw new Error("Failed to fetch databases");
			}
			return response.json();
		},
	});

	const deleteDatabase = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/databases?id=${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete database");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Database deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["databases"] });
		},
		onError: (error) => {
			console.error("Error deleting database:", error);
			toast.error("Failed to delete database");
		},
	});

	const handleDeleteDatabase = (id: string) => {
		deleteDatabase.mutate(id);
		if (selectedDb === id) setSelectedDb(null);
	};

	useImperativeHandle(ref, () => ({
		createNewDatabase: () => setAddDialogOpen(true),
	}));

	const fuse = new Fuse(databases, {
		keys: ["name", "description"],
		threshold: 0.4,
	});
	const filteredDatabases = searchQuery.trim()
		? fuse.search(searchQuery).map((result) => result.item)
		: databases;

	const getStatusColor = (status: VectorDatabase["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-700 border-green-200";
			case "indexing":
				return "bg-blue-100 text-blue-700 border-blue-200";
			case "error":
				return "bg-red-100 text-red-700 border-red-200";
		}
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat().format(num);
	};

	return (
		<div className="flex flex-col h-full">
			<TitleBar
				title="Vector Databases"
				extra={
					<div>
						{/* Search Icon */}
						<Button
							variant="ghost"
							size="icon"
							className=" hover:bg-gray-100"
							onClick={() => setShowSearch(!showSearch)}
						>
							<Search className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className=" hover:bg-gray-100"
							onClick={() => setAddDialogOpen(true)}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				}
			/>

			{showSearch && (
				<AnimatePresence mode="sync">
					<motion.div
						className="overflow-hidden"
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
					>
						<motion.div
							className="p-4"
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
						>
							<div className="relative">
								<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search databases..."
									className="pl-9 transition-shadow duration-200 focus:shadow-md"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									autoFocus
								/>
							</div>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}

			<DatabaseConfig open={addDialogOpen} onOpenChange={setAddDialogOpen} />

			<div className="flex-1 overflow-auto">
				{loading ? (
					<div className="space-y-2 p-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex flex-col gap-2 px-3 py-2 border-b">
								<div className="flex items-center gap-3">
									<Skeleton className="h-5 w-5 rounded-sm" />
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<div className="flex gap-2 items-center">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-4 w-16" />
											</div>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-48" />
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : filteredDatabases.length === 0 ? (
					searchQuery ? (
						<EmptyState
							icon={<EmptyStateIcons.Search />}
							title="No databases found"
							description={`No databases match "${searchQuery}". Try adjusting your search terms or check your spelling.`}
							className="min-h-[300px]"
						/>
					) : (
						<EmptyState
							icon={<EmptyStateIcons.Database />}
							title="No databases configured"
							description="Get started by adding your first vector database. Connect to popular services like Pinecone, Chroma, or Qdrant."
							action={{
								label: "Add Database",
								onClick: () => setAddDialogOpen(true),
							}}
							className="min-h-[300px]"
						/>
					)
				) : (
					filteredDatabases.map((db: VectorDatabase) => (
						<div
							key={db.id}
							className={`
                            group px-3 py-2 hover:bg-gray-50 cursor-pointer border-l-2 border-b
                            ${
															selectedDb === db.id
																? "border-l-blue-500 bg-blue-50/50"
																: "border-l-transparent"
														}
                        `}
							onClick={() => setSelectedDb(db.id)}
							onKeyUp={(e) => {
								if (e.key === "Enter") {
									setSelectedDb(db.id);
								}
							}}
						>
							<div className="flex items-center gap-3">
								<div className="relative shrink-0">
									<Image
										src={dbtype_images[db.type as keyof typeof dbtype_images]}
										alt={db.type}
										className="w-5 h-5 object-contain rounded-sm"
										width={20}
										height={20}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between">
										<div className="truncate">
											<span className="font-medium text-sm">
												{db.collectionName}
											</span>
											<span className="mx-2 text-gray-400">·</span>
											<span className="text-xs text-gray-500">
												{formatNumber(db.documentCount || 0)} docs
											</span>
										</div>
										<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6"
													>
														<Settings2 className="h-3.5 w-3.5" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Configure database</TooltipContent>
											</Tooltip>
											<AlertDialog>
												<Tooltip>
													<TooltipTrigger asChild>
														<AlertDialogTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6 text-red-500 hover:text-red-700"
																onClick={(e) => {
																	e.stopPropagation();
																}}
																disabled={deleteDatabase.isPending}
															>
																<Trash2 className="h-3.5 w-3.5" />
															</Button>
														</AlertDialogTrigger>
													</TooltipTrigger>
													<TooltipContent>Delete database</TooltipContent>
												</Tooltip>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Delete Database</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to delete this database
															configuration? This will remove the connection
															settings but won&apos;t affect your actual
															database. This action cannot be undone.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => {
																handleDeleteDatabase(db.id);
															}}
															disabled={deleteDatabase.isPending}
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</div>
									<div className="flex items-center gap-2 text-xs text-gray-500">
										<Badge
											variant="outline"
											className={`${getStatusColor(
												db.status,
											)} px-1.5 py-0 h-4 text-[10px] font-normal`}
										>
											{db.status.charAt(0).toUpperCase() + db.status.slice(1)}
										</Badge>
										<span className="truncate text-xs text-gray-500">
											{db.description}
										</span>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
});

export default DatabaseList;
