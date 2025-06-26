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
import { sample_prompts } from "@/lib/sample-db";
import { useRouter } from "next/navigation";

interface Prompt {
	id: string;
	name: string;
	lastModified: Date;
	status: "draft" | "ready" | "needs-review";
	testStats: {
		passed: number;
		total: number;
	};
	securityIssues: number;
}

export const PromptList = forwardRef(function PromptList(_props, ref) {
	const [prompts, setPrompts] = useState<Prompt[]>(sample_prompts as Prompt[]);
	const [isRenaming, setIsRenaming] = useState<string | null>(null);
	const [newName, setNewName] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const handleNewPrompt = () => {
		const newPrompt: Prompt = {
			id: Math.random().toString(36).substring(7),
			name: "New Prompt",
			lastModified: new Date(),
			status: "draft",
			testStats: { passed: 0, total: 0 },
			securityIssues: 0,
		};
		setPrompts([...prompts, newPrompt]);
		setIsRenaming(newPrompt.id);
	};

	useImperativeHandle(ref, () => ({
		createNewPrompt: handleNewPrompt,
	}));

	const handleRename = (promptId: string) => {
		setIsRenaming(promptId);
		setNewName(prompts.find((p) => p.id === promptId)?.name || "");
	};

	const handleRenameSubmit = (promptId: string) => {
		if (newName.trim()) {
			setPrompts(
				prompts.map((p) =>
					p.id === promptId
						? {
								...p,
								name: newName.trim(),
								lastModified: new Date(),
							}
						: p,
				),
			);
		}
		setIsRenaming(null);
		setNewName("");
	};

	const handleDelete = (promptId: string) => {
		setPrompts(prompts.filter((p) => p.id !== promptId));
	};

	const handleDuplicate = (prompt: Prompt) => {
		const newPrompt: Prompt = {
			...prompt,
			id: Math.random().toString(36).substring(7),
			name: `${prompt.name} (Copy)`,
			lastModified: new Date(),
			status: "draft",
		};
		setPrompts([...prompts, newPrompt]);
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
		router.push(`/prompts/${promptId}`);
	};

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
				{filteredPrompts.map((prompt) => (
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
										{prompt.name}
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
									<DropdownMenuItem onClick={() => handleDuplicate(prompt)}>
										Duplicate
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600"
										onClick={() => handleDelete(prompt.id)}
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
											prompt.testStats.passed === prompt.testStats.total
												? "secondary"
												: "outline"
										}
										className="h-4 text-[10px]"
									>
										{prompt.testStats.passed}/{prompt.testStats.total}
									</Badge>
								</TooltipTrigger>
								<TooltipContent>Test Cases</TooltipContent>
							</Tooltip>
							{prompt.securityIssues > 0 && (
								<Tooltip>
									<TooltipTrigger>
										<Badge variant="destructive" className="h-4 text-[10px]">
											{prompt.securityIssues} issue
											{prompt.securityIssues > 1 ? "s" : ""}
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
							{formatDistanceToNow(prompt.lastModified, {
								addSuffix: true,
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
