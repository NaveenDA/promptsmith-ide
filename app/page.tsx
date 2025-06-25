"use client";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ModelConfig } from "@/components/ModelConfig";
import PromptEditor from "@/components/PromptEditor";
import { MessageGroup } from "@/components/MessageGroup";
import { RightSidebar } from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Header from "@/components/header";

export default function Home() {
	return (
		<>
			<Header />
			<ResizablePanelGroup
				direction="horizontal"
				className="min-h-[calc(100vh-40px)]"
			>
				<ResizablePanel defaultSize={15}>
					<LeftSidebar />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={55}>
					<PromptEditor />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={25}>
					<RightSidebar />
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
}
