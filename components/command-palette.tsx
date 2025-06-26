"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	FileText,
	Database,
	Play,
	Search,
	type LucideIcon,
} from "lucide-react";

interface CommandItem {
	id: string;
	name: string;
	icon?: LucideIcon;
	shortcut?: string;
	action?: () => void;
	children?: CommandItem[];
}

const commands: CommandItem[] = [
	{
		id: "prompts",
		name: "Prompts",
		icon: FileText,
		children: [
			{
				id: "new-prompt",
				name: "New Prompt",
				shortcut: "⌘N",
			},
			{
				id: "open-prompt",
				name: "Open Prompt",
				shortcut: "⌘P",
			},
		],
	},
	{
		id: "datasets",
		name: "Datasets",
		icon: Database,
		children: [
			{
				id: "new-dataset",
				name: "New Dataset",
			},
			{
				id: "open-dataset",
				name: "Open Dataset",
			},
		],
	},
	{
		id: "test-cases",
		name: "Test Cases",
		icon: Play,
		children: [
			{
				id: "run-all-tests",
				name: "Run All Tests",
				shortcut: "⌘R",
			},
			{
				id: "new-test",
				name: "New Test Case",
			},
		],
	},
];

export function CommandPalette() {
	const [open, setOpen] = useState(false);

	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="p-0 bg-[#1e1e1e] border-[#333333] max-w-2xl">
				<Command className="rounded-lg border shadow-md">
					<div
						className="flex items-center border-b border-[#333333] px-3"
						cmdk-input-wrapper=""
					>
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<Command.Input
							placeholder="Type a command or search..."
							className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
						<Command.Empty className="py-6 text-center text-sm">
							No results found.
						</Command.Empty>
						{commands.map((group) => (
							<Command.Group key={group.id} heading={group.name}>
								{group.children?.map((item) => (
									<Command.Item
										key={item.id}
										onSelect={() => {
											if (item.action) {
												item.action();
											}
											setOpen(false);
										}}
										className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-[#2d2d2d] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									>
										<div className="flex items-center gap-2 flex-1">
											{group.icon && <group.icon className="h-4 w-4" />}
											<span>{item.name}</span>
										</div>
										{item.shortcut && (
											<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
												{item.shortcut}
											</kbd>
										)}
									</Command.Item>
								))}
							</Command.Group>
						))}
					</Command.List>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
