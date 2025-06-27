"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	MoreVertical,
	Plus,
	Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import TitleBar from "@/components/ui/title-bar";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Prompt {
	id: string;
	title: string;
	lastModified: Date;
	testCasesTotal: number;
	testCasesPassed: number;
	securityIssuesTotal: number;
	securityIssuesPassed: number;
	status: "draft" | "ready" | "needs-review";
	testStats: {
		passed: number;
		total: number;
	};
	securityIssues: number;
}

export const PromptList = forwardRef(function PromptList(_props, ref) {
	const queryClient = useQueryClient();
	const {
		data: prompts = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["prompts"],
		queryFn: async () => {
			const res = await fetch("/api/prompts");
			if (!res.ok) throw new Error("Failed to fetch prompts");
			return res.json();
		},
	});
	const [isRenaming, setIsRenaming] = useState<string | null>(null);
	const [newName, setNewName] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const handleNewPrompt = async () => {
		const res = await fetch("/api/prompts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "New Prompt", content: "" }),
		});
		if (res.ok) {
			await queryClient.invalidateQueries({ queryKey: ["prompts"] });
		}
	};

	const addPromptMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/prompts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: "New Prompt", content: "" }),
			});
			if (!res.ok) throw new Error("Failed to add prompt");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
	});

	const deletePromptMutation = useMutation({
		mutationFn: async (promptId: string) => {
			const res = await fetch(`/api/prompts/${promptId}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete prompt");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
	});
	const renamePromptMutation = useMutation({
		mutationFn: async ({
			promptId,
			newName,
		}: { promptId: string; newName: string }) => {
			const res = await fetch(`/api/prompts/${promptId}`, {
				method: "PUT",
				body: JSON.stringify({ title: newName }),
			});
			if (!res.ok) throw new Error("Failed to rename prompt");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
	});

	useImperativeHandle(ref, () => ({
		createNewPrompt: addPromptMutation.mutate,
	}));

	const handleRename = (promptId: string) => {
		setIsRenaming(promptId);
		setNewName(prompts.find((p: Prompt) => p.id === promptId)?.name || "");
	};

	const handleRenameSubmit = (promptId: string) => {
		if (newName.trim()) {
			renamePromptMutation.mutate({ promptId, newName });
		}
		setIsRenaming(null);
		setNewName("");
	};

	const handleDelete = (promptId: string) => {
		deletePromptMutation.mutate(promptId);
	};

	const getStatusIcon = (status: Prompt["status"]) => {
		switch (status) {
			case "ready":
				return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
			case "needs-review":
				return <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />;
			default:
				return <Clock className="h-3.5 w-3.5 text-gray-400" />;
		}
	};

	const fuse = new Fuse(prompts, {
		keys: ["name", "category"],
		threshold: 0.4,
	});
	const filteredPrompts = searchQuery.trim()
		? fuse.search(searchQuery).map((result) => result.item)
		: prompts;

	const handlePromptClick = (promptId: string) => {
		router.push(`/app/prompts/${promptId}`);
	};

	if (isLoading) return <div className="p-4">Loading prompts...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Failed to load prompts.</div>;

	return (
		<div className="h-full flex flex-col">
			<TitleBar
				title="Prompts"
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
							onClick={handleNewPrompt}
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
						transition={{
							duration: 0.3,
							ease: [0.4, 0, 0.2, 1],
						}}
					>
						<motion.div
							className="p-2"
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{
								duration: 0.2,
								ease: "easeOut",
								delay: 0.1,
							}}
						>
							<Input
								placeholder="Search prompts..."
								autoFocus
								className="transition-shadow duration-200 focus:shadow-md"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}
			<div className="flex-1 overflow-auto">
				{filteredPrompts.map((prompt: Prompt) => (
					<div
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								handlePromptClick(prompt.id);
							}
						}}
						key={prompt.id}
						className={cn(
							"group flex flex-col px-2 py-1.5 hover:bg-gray-100 cursor-pointer border-l-2 transition-colors border-b",
							"border-l-transparent",
						)}
						onClick={() => handlePromptClick(prompt.id)}
					>
						<div className="flex items-center justify-between min-w-0">
							<div className="flex items-center gap-2 min-w-0 flex-1">
								<Tooltip>
									<TooltipTrigger>
										{getStatusIcon(prompt.status)}
									</TooltipTrigger>
									<TooltipContent>{prompt.status}</TooltipContent>
								</Tooltip>
								{isRenaming === prompt.id ? (
									<Input
										value={newName}
										onChange={(e) => setNewName(e.target.value)}
										onBlur={() => handleRenameSubmit(prompt.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleRenameSubmit(prompt.id);
											}
										}}
										className="h-6 text-xs"
										autoFocus
									/>
								) : (
									<span className="text-sm truncate font-medium">
										{prompt.title}
									</span>
								)}
							</div>
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
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuItem onClick={() => handleRename(prompt.id)}>
										Rename
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600"
										onClick={() => handleDelete(prompt.id)}
										disabled={deletePromptMutation.isPending}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex items-center gap-2 mt-1 pl-5">
							<Tooltip>
								<TooltipTrigger>
									<Badge
										variant={
											prompt?.testCasesPassed === prompt?.testCasesTotal
												? "secondary"
												: "outline"
										}
										className="h-4 text-[10px]"
									>
										{prompt?.testCasesPassed}/{prompt?.testCasesTotal}
									</Badge>
								</TooltipTrigger>
								<TooltipContent>Test Cases</TooltipContent>
							</Tooltip>
							{prompt.securityIssuesTotal > 0 && (
								<Tooltip>
									<TooltipTrigger>
										<Badge variant="destructive" className="h-4 text-[10px]">
											{prompt.securityIssuesTotal} issue
											{prompt.securityIssuesTotal > 1 ? "s" : ""}
										</Badge>
									</TooltipTrigger>
									<TooltipContent>Security Issues</TooltipContent>
								</Tooltip>
							)}
						</div>
						<div
							className="text-[10px] text-gray-400 mt-0.5 pl-5"
							suppressHydrationWarning
						>
							Updated{" "}
							{formatDistanceToNow(prompt.lastModified || new Date(), {
								addSuffix: true,
							})}
						</div>
					</div>
				))}
			</div>
			{deletePromptMutation.isError && (
				<div className="p-2 text-red-500 text-xs">Failed to delete prompt.</div>
			)}
		</div>
	);
});
