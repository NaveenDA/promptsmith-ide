"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Clock,
	ChevronRight,
	ChevronDown,
	ArrowUpRight,
	RotateCcw,
	Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface PromptVersion {
	id: string;
	title: string;
	content: string;
	model: {
		provider: string;
		name: string;
		temperature: number;
	};
	createdAt: Date;
	performance?: {
		tokens: number;
		latency: number;
		cost: number;
	};
}

export function History() {
	const [versions, setVersions] = useState<PromptVersion[]>([
		{
			id: "1",
			title: "Initial Version",
			content: "This is the first version of the prompt...",
			model: {
				provider: "OpenAI",
				name: "gpt-4",
				temperature: 0.7,
			},
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
			performance: {
				tokens: 150,
				latency: 1200,
				cost: 0.002,
			},
		},
		{
			id: "2",
			title: "Added Variables",
			content: "Updated version with {{variable}} support...",
			model: {
				provider: "OpenAI",
				name: "gpt-4",
				temperature: 0.5,
			},
			createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
			performance: {
				tokens: 180,
				latency: 1500,
				cost: 0.0025,
			},
		},
	]);

	const [expandedVersions, setExpandedVersions] = useState<
		Record<string, boolean>
	>({});

	const toggleVersion = (versionId: string) => {
		setExpandedVersions((prev) => ({
			...prev,
			[versionId]: !prev[versionId],
		}));
	};

	return (
		<div className="h-full flex flex-col bg-white">
			<div className="flex-1 overflow-auto">
				{versions.map((version) => (
					<div key={version.id} className="border-b">
						<button
							type="button"
							onClick={() => toggleVersion(version.id)}
							className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
						>
							{expandedVersions[version.id] ? (
								<ChevronDown className="w-4 h-4 text-gray-400" />
							) : (
								<ChevronRight className="w-4 h-4 text-gray-400" />
							)}
							<div className="flex-1 text-left">
								<div className="flex items-center gap-2">
									<span className="font-medium text-gray-700">
										{version.title}
									</span>
									<span className="text-xs text-gray-500">
										{formatDistanceToNow(version.createdAt, {
											addSuffix: true,
										})}
									</span>
								</div>
								<div className="flex items-center gap-1 mt-1">
									<Badge variant="outline" className="text-xs text-gray-600">
										{version.model.provider}
									</Badge>
									<Badge variant="outline" className="text-xs text-gray-600">
										{version.model.name}
									</Badge>
								</div>
							</div>
						</button>

						{expandedVersions[version.id] && (
							<div className="px-3 pb-2">
								<div className="bg-gray-50 rounded p-2 font-mono text-sm text-gray-600 mb-2">
									<pre className="whitespace-pre-wrap">{version.content}</pre>
								</div>
								{version.performance && (
									<div className="flex items-center gap-4 text-xs text-gray-500">
										<span>Tokens: {version.performance.tokens}</span>
										<span>Latency: {version.performance.latency}ms</span>
										<span>Cost: ${version.performance.cost}</span>
									</div>
								)}
								<div className="flex items-center gap-2 mt-2">
									<Button variant="outline" size="sm" className="gap-2">
										<RotateCcw className="w-3 h-3" />
										Restore
									</Button>
									<Button variant="outline" size="sm" className="gap-2">
										<Copy className="w-3 h-3" />
										Duplicate
									</Button>
									<Button variant="outline" size="sm" className="gap-2">
										<ArrowUpRight className="w-3 h-3" />
										Compare
									</Button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
