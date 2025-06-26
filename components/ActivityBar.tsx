"use client";

import { Button } from "./ui/button";
import {
	Database,
	FileText,
	Wrench,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import { useAtom } from "jotai";
import { SELECTED_ACTIVITY_BAR_TAB } from "./atoms";



export function ActivityBar() {
	const [selectedTab, setSelectedTab] = useAtom(SELECTED_ACTIVITY_BAR_TAB);
	return (
		<div className="w-12 border-r bg-gray-50/50 flex flex-col items-center py-2 gap-1">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={selectedTab === "prompts" ? "default" : "ghost"}
							size="icon"
							className="h-10 w-10"
							onClick={() => setSelectedTab("prompts")}
						>
							<FileText className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Prompts</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={selectedTab === "database" ? "default" : "ghost"}
							size="icon"
							className="h-10 w-10"
							onClick={() => setSelectedTab("database")}
						>
							<Database className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Vector Databases</p>
					</TooltipContent>
				</Tooltip>
				{/* tools */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={selectedTab === "tools" ? "default" : "ghost"}
							size="icon"
							className="h-10 w-10"
							onClick={() => setSelectedTab("tools")}
						>
							<Wrench className="h-5 w-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Tools</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
