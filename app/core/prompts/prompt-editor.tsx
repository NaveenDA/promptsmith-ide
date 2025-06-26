"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { modelConfigAtom } from "@/lib/store";
import { ModelConfigDialog } from "@/app/core/models/model-config";
import { useAtom } from "jotai";
import { sample_prompts } from "@/lib/sample-db";
import MonacoEditor from "@monaco-editor/react";

interface PromptEditorProps {
	selectedPromptId?: string | null;
}

const PromptEditor = forwardRef(function PromptEditor(
	{ selectedPromptId }: PromptEditorProps,
	ref,
) {
	const [title, setTitle] = useState("Extract Model Names");
	const [content, setContent] = useState(
		`Your task is to extract model names from machine learning paper abstracts. Your response is an array of the model names in the format [\"model_name\"]. If you don't find model names in the abstract or you are not sure, return [\"NA\"]\n\nAbstract: Large Language Models (LLMs), such as ChatGPT and GPT-4, have revolutionized natural language processing research and demonstrated potential in Artificial General Intelligence (AGI). However, the expensive training and deployment of LLMs present challenges to transparent and open academic research. To address these issues, this project open-sources the Chinese LLaMA and Alpaca…`,
	);
	const [config] = useAtom(modelConfigAtom);

	useEffect(() => {
		if (selectedPromptId) {
			const prompt = sample_prompts.find((p) => p.id === selectedPromptId);
			if (prompt) {
				setTitle(prompt.name);
				setContent(prompt.fullPrompt.trim());
			}
		} else {
			setTitle("Extract Model Names");
			setContent(
				`Your task is to extract model names from machine learning paper abstracts. Your response is an array of the model names in the format [\"model_name\"]. If you don't find model names in the abstract or you are not sure, return [\"NA\"]\n\nAbstract: Large Language Models (LLMs), such as ChatGPT and GPT-4, have revolutionized natural language processing research and demonstrated potential in Artificial General Intelligence (AGI). However, the expensive training and deployment of LLMs present challenges to transparent and open academic research. To address these issues, this project open-sources the Chinese LLaMA and Alpaca…`,
			);
		}
	}, [selectedPromptId]);

	const savePrompt = () => {
		// Implement your save logic here (e.g., API call, local storage, etc.)
		console.log("Prompt saved:", { title, content });
		// You can show a toast or notification here
	};

	useImperativeHandle(ref, () => ({
		savePrompt,
	}));

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
								src={`/logos/${config.provider.toLowerCase()}.svg`}
								alt={config.provider}
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
							temp: {config.parameters.temperature}
						</Badge>
						<ModelConfigDialog />
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="default"
							size="xs"
							className="gap-2"
							onClick={savePrompt}
						>
							<Save className="w-4 h-4" />
							Save
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
						options={{
							minimap: { enabled: false },
							wordWrap: "on",
							fontSize: 14,
							lineNumbers: "on",
						}}
					/>
				</div>
			</div>
		</div>
	);
});

export default PromptEditor;
