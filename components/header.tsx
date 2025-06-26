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
import { ApiKeysDialog } from "../app/core/models/api-keys-dialog";
import Image from "next/image";

export default function Header() {
	return (
		<div className="h-10 bg-white border-b flex items-center px-4 justify-between sticky top-0 z-10">
			<div className="flex items-center gap-2">
				<Image src="/logo.svg" alt="Promptsmith" height={40} width={130} />
			</div>
			<div className="flex items-center gap-4">
				<ApiKeysDialog />
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Settings className="w-4 h-4" />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="gap-2 h-8">
							<User className="w-4 h-4" />
							<span>John Doe</span>
							<ChevronDown className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className="w-4 h-4 mr-2" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="w-4 h-4 mr-2" />
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
