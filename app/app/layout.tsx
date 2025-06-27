"use client";
import Header from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Header />
				{children}
			</TooltipProvider>
		</QueryClientProvider>
	);
}
