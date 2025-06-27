"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { modelConfigAtom } from "@/lib/store";
import { ModelConfigDialog } from "@/app/app/core/models/model-config";
import { useAtom } from "jotai";
import MonacoEditor from "@monaco-editor/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PromptEditorProps {
	selectedPromptId?: string | null;
}

const PromptEditor = forwardRef(function PromptEditor(
	{ selectedPromptId }: PromptEditorProps,
	ref,
) {
	const [title, setTitle] = useState("New Prompt");
	const [content, setContent] = useState("\n\n\n");
	const [config, setConfig] = useAtom(modelConfigAtom);
	const [isFocused, setIsFocused] = useState(false);
	const [unsaved, setUnsaved] = useState(false);

	// Fetch prompt versions
	const { data: versions = [], isLoading } = useQuery({
		queryKey: ["prompt-versions", selectedPromptId],
		queryFn: async () => {
			if (!selectedPromptId) return [];
			const res = await fetch(
				`/api/prompt-versions?promptId=${selectedPromptId}`,
			);
			if (!res.ok) throw new Error("Failed to fetch prompt versions");
			return res.json();
		},
		enabled: !!selectedPromptId,
	});

	// Fetch prompt draft (main prompt)
	const { data: promptDraft } = useQuery({
		queryKey: ["prompt", selectedPromptId],
		queryFn: async () => {
			if (!selectedPromptId) return null;
			const res = await fetch(`/api/prompts/${selectedPromptId}`);
			if (!res.ok) throw new Error("Failed to fetch prompt");
			return res.json();
		},
		enabled: !!selectedPromptId,
	});

	// Set content and model config from draft or latest version
	useEffect(() => {
		if (selectedPromptId && promptDraft) {
			setTitle(promptDraft.title || "New Prompt");
			setContent(promptDraft.content || "\n\n\n");
			if (promptDraft.modelParams) setConfig(promptDraft.modelParams);
		} else if (selectedPromptId && versions.length > 0) {
			setTitle("New Prompt");
			setContent(versions[0].content);
		} else if (!selectedPromptId) {
			setTitle("New Prompt");
			setContent("\n\n\n");
		}
	}, [selectedPromptId, promptDraft, versions, setConfig]);

	// Track unsaved changes
	useEffect(() => {
		setUnsaved(true);
	}, [content, config]);

	const versionMutation = useMutation({
		mutationFn: async () => {
			if (!selectedPromptId) throw new Error("No prompt selected");
			const res = await fetch("/api/prompt-versions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					promptId: selectedPromptId,
					content,
					modelParams: config,
				}),
			});
			if (!res.ok) throw new Error("Failed to save version");
			return res.json();
		},
		onSuccess: (data) => {
			setUnsaved(false);
			if (data?.message === "No changes detected. Version not incremented.") {
				toast.info("No changes detected. Version not incremented.");
			} else {
				toast.success("Prompt version saved!");
			}
		},
	});

	const saveDraftMutation = useMutation({
		mutationFn: async () => {
			if (!selectedPromptId) throw new Error("No prompt selected");
			const res = await fetch(`/api/prompts/${selectedPromptId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content, modelParams: config }),
			});
			if (!res.ok) throw new Error("Failed to save draft");
			return res.json();
		},
		onSuccess: () => {
			setUnsaved(false);
			toast.success("Draft saved!");
		},
	});

	const savePrompt = () => {
		versionMutation.mutate();
	};

	useImperativeHandle(ref, () => ({
		savePrompt,
	}));

	if (isLoading) return <div>Loading prompt...</div>;

	return (
		<div className="h-full flex flex-col">
			{/* Title and Model Info Bar */}
			<div className="border-b bg-gray-50 p-2">
				<div className="flex items-center gap-2 mb-2">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="text-lg font-semibold bg-transparent border-0 px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700"
						placeholder="Enter prompt title..."
					/>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-gray-600">
							<Image
								src={`/logos/${config?.provider?.toLowerCase()}.svg`}
								alt={config.provider || "provider"}
								width={12}
								height={12}
							/>{" "}
							&nbsp;
							{config.provider}
						</Badge>
						<Badge variant="outline" className="text-gray-600">
							{config.name}
						</Badge>
						<Badge variant="outline" className="text-gray-600">
							temp: {config?.parameters?.temperature}
						</Badge>
						<ModelConfigDialog />
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="xs"
							className="gap-2"
							onClick={() => saveDraftMutation.mutate()}
							disabled={!unsaved || saveDraftMutation.isPending}
						>
							Save Draft
						</Button>
						<Button
							variant="default"
							size="xs"
							className="gap-2"
							onClick={savePrompt}
						>
							<Save className="w-4 h-4" />
							Save Version
						</Button>
					</div>
				</div>
			</div>

			<div className="relative h-full">
				<div className="absolute inset-0">
					<MonacoEditor
						height="100%"
						defaultLanguage="markdown"
						theme="light"
						value={content}
						onChange={(value) => setContent(value || "")}
						onMount={(editor) => {
							editor.onDidFocusEditorWidget(() => setIsFocused(true));
							editor.onDidBlurEditorWidget(() => setIsFocused(false));
						}}
						options={{
							minimap: { enabled: false },
							wordWrap: "on",
							fontSize: 14,
							lineNumbers: "on",
						}}
					/>
					{/* Placeholder overlay */}
					{content === "\n\n\n" && !isFocused && (
						<div
							className="absolute top-0 left-18 text-gray-400 pointer-events-none select-none"
							style={{ zIndex: 1 }}
						>
							Enter your prompt here...
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

export default PromptEditor;
