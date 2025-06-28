"use client";

import MdxLayout from "@/components/mdx-layout";
import type { ReactNode } from "react";
import {
	Home,
	Rocket,
	Zap,
	Code,
	Settings,
	Database,
	Shield,
	Menu,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import FooterSections from "../(website)/footer-sections";
import { Skeleton } from "@/components/ui/skeleton";

interface DocsLayoutProps {
	children: ReactNode;
}

const navigation = [
	{
		title: "Getting Started",
		items: [
			{ title: "Introduction", href: "/docs", icon: Home },
			{ title: "Installation", href: "/docs/installation", icon: Rocket },
			{ title: "Quick Start", href: "/docs/quick-start", icon: Zap },
		],
	},
	{
		title: "Core Concepts",
		items: [
			{ title: "Components", href: "/docs/components", icon: Code },
			{ title: "Styling", href: "/docs/styling", icon: Settings },
			{ title: "Data Fetching", href: "/docs/data-fetching", icon: Database },
		],
	},
	{
		title: "Advanced",
		items: [
			{ title: "Authentication", href: "/docs/authentication", icon: Shield },
			{ title: "Deployment", href: "/docs/deployment", icon: Rocket },
			{ title: "Performance", href: "/docs/performance", icon: Zap },
		],
	},
];

export default function DocsLayout({ children }: DocsLayoutProps) {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Link href="/" className="flex items-center space-x-2">
								<Image
									src="/logo.svg"
									alt="PromptSmith IDE"
									width={132}
									height={32}
								/>
							</Link>
						</div>
						<nav className="hidden md:flex items-center space-x-6">
							<Link href="/docs" className="text-blue-600 font-medium">
								Documentation
							</Link>
							<Link
								href="/app"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Access PromptSmith IDE
							</Link>
							<Link
								href="https://github.com/naveenda/promptsmith-ide"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Github
							</Link>
						</nav>
						<div className="flex items-center space-x-4">
							<div className="relative hidden sm:block">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input placeholder="Search docs..." className="pl-10 w-64" />
							</div>
							<Button
								variant="outline"
								size="sm"
								className="md:hidden bg-transparent"
							>
								<Menu className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<div className="flex gap-8">
					{/* Sidebar */}
					<aside className="hidden md:block w-64 shrink-0">
						<div className="sticky top-24">
							<Suspense
								fallback={
									<div className="space-y-4 p-4">
										<Skeleton className="h-8 w-1/2" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
										<Skeleton className="h-4 w-2/3" />
										<Skeleton className="h-4 w-1/3" />
									</div>
								}
							>
								<ScrollArea className="h-[calc(100vh-8rem)]">
									<div className="space-y-6">
										{navigation.map((section) => (
											<div key={section.title}>
												<h3 className="font-semibold text-gray-900 mb-3">
													{section.title}
												</h3>
												<ul className="space-y-1">
													{section.items.map((item) => {
														const Icon = item.icon;
														return (
															<li key={item.href}>
																<Link
																	href={item.href}
																	className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
																>
																	<Icon className="h-4 w-4" />
																	<span>{item.title}</span>
																</Link>
															</li>
														);
													})}
												</ul>
											</div>
										))}
									</div>
								</ScrollArea>
							</Suspense>
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1 max-w-4xl">
						<MdxLayout>{children}</MdxLayout>
					</main>

					{/* Table of Contents */}
				</div>
			</div>
			<FooterSections />
		</div>
	);
}
