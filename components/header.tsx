"use client";

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
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { ApiKeysDialog } from "@/app/app/core/models/api-keys-dialog";

export default function Header() {

	return (
		<div className="h-10 bg-white border-b flex items-center px-4 justify-between sticky top-0 z-10">
			<div className="flex items-center gap-2">
				<Image
					src="/logo.svg"
					alt="Promptsmith"
					height={40}
					width={130}
				/>
			</div>
			<div className="flex items-center gap-1">
				<ApiKeysDialog />
				<Button
					variant="ghost"
					className="gap-2 h-8"
				>
					<UserButton showName={true} />
					<ChevronDown className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
