"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

interface PromptVersion {
	id: string;
	version: number;
	content: string;
	modelParams: {
		provider: string;
		name: string;
		parameters: Record<string, unknown>;
	};
	createdAt: string;
	performance?: {
		tokens: number;
		latency: number;
		cost: number;
	};
}

export function History({ promptId }: { promptId: string }) {
	const [expandedVersions, setExpandedVersions] = useState<
		Record<string, boolean>
	>({});
	const queryClient = useQueryClient();

	const {
		data: versions = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["prompt-versions", promptId],
		queryFn: async () => {
			const res = await fetch(`/api/prompts/${promptId}/versions`);
			if (!res.ok) throw new Error("Failed to fetch prompt versions");
			return res.json();
		},
		enabled: !!promptId,
	});

	const restoreMutation = useMutation({
		mutationFn: async (version: PromptVersion) => {
			const res = await fetch(`/api/prompts/${promptId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: version.content,
					modelParams: version.modelParams,
				}),
			});
			if (!res.ok) throw new Error("Failed to restore version");
			return res.json();
		},
		onSuccess: () => {
			toast.success("Prompt restored to this version!");
			queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
			queryClient.invalidateQueries({
				queryKey: ["prompt-versions", promptId],
			});
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
	});

	const toggleVersion = (versionId: string) => {
		setExpandedVersions((prev) => ({
			...prev,
			[versionId]: !prev[versionId],
		}));
	};

	if (isLoading) return <div className="p-4">Loading history...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Failed to load history.</div>;

	if (!isLoading && versions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-gray-400">
				<svg
					className="w-12 h-12 mb-2"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					viewBox="0 0 24 24"
				>
					<title>No history yet</title>
					<circle
						cx="12"
						cy="12"
						r="9"
						stroke="currentColor"
						strokeWidth="1.5"
						fill="none"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 7v5l3 2"
						stroke="currentColor"
						strokeWidth="1.5"
					/>
				</svg>
				<div className="font-medium">No history yet</div>
				<div className="text-xs mt-1">
					Save a version to see prompt history here.
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-white">
			<div className="flex-1 overflow-auto">
				{versions.map((version: PromptVersion) => (
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
										Version {version.version}
									</span>
									<span className="text-xs text-gray-500">
										{formatDistanceToNow(new Date(version.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
								<div className="flex items-center gap-1 mt-1">
									<Badge variant="outline" className="text-xs text-gray-600">
										<Image
											src={`/logos/${version.modelParams.provider.toLowerCase()}.svg`}
											alt={version.modelParams.provider || "provider"}
											width={10}
											height={10}
										/>
										&nbsp;
										{version.modelParams.provider}
									</Badge>
									<Badge variant="outline" className="text-xs text-gray-600">
										{version.modelParams.name}
									</Badge>
								</div>
							</div>
						</button>

						{expandedVersions[version.id] && (
							<div className="px-3 pb-2">
								<div className="bg-gray-50 rounded p-2 font-mono text-sm text-gray-600 mb-2 max-h-[50vh] overflow-y-auto">
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
									<Button
										variant="outline"
										size="xs"
										className="gap-2"
										onClick={() => restoreMutation.mutate(version)}
										disabled={restoreMutation.isPending}
									>
										<RotateCcw className="w-3 h-3" />
										Restore
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
