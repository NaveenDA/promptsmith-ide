import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Settings } from "lucide-react";
import {
	AVAILABLE_MODELS,
	type ModelConfig,
	modelConfigAtom,
	ModelParametersSchema,
	selectedPromptIdAtom,
} from "@/lib/store";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function ModelConfigDialog() {
	const [config, setConfig] = useAtom(modelConfigAtom);
	const [open, setOpen] = useState(false);

	const selectedPromptId = useAtomValue(selectedPromptIdAtom);

	const setModelConfig = useSetAtom(modelConfigAtom);

	const updateConfig = (partialConfig: Partial<ModelConfig>) => {
		setConfig({ ...config, ...partialConfig });
	};

	const saveDraftMutation = useMutation({
		mutationFn: async (modelParams: ModelConfig) => {
			if (!selectedPromptId) throw new Error("No prompt selected");
			const res = await fetch(`/api/prompts/${selectedPromptId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ modelParams }),
			});
			if (!res.ok) throw new Error("Failed to save model config");
			return res.json();
		},
		onSuccess: () => {
			toast.success("Model config saved!");
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="xs" className="gap-1">
					<Settings className="w-3 h-3" />
					Configure
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Model Configuration</DialogTitle>
					<DialogDescription>
						Configure the model and its parameters for generation.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="flex gap-4">
						{/* Provider Selection */}
						<div className="space-y-2 w-1/2">
							<Label>Provider</Label>
							<Select
								value={config.provider}
								onValueChange={(value: keyof typeof AVAILABLE_MODELS) => {
									updateConfig({
										provider: value,
										name: AVAILABLE_MODELS[value][0],
										parameters: ModelParametersSchema.parse({
											temperature: 0.7,
											max_tokens: 2000,
											top_p: 1,
											frequency_penalty: 0,
											presence_penalty: 0,
										}),
									});
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(AVAILABLE_MODELS).map((provider) => (
										<SelectItem key={provider} value={provider}>
											<div className="flex items-center gap-2">
												<Image
													src={`/logos/${provider.toLowerCase()}.svg`}
													alt={provider || "provider"}
													width={16}
													height={16}
												/>
												{provider}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Model Selection */}
						<div className="space-y-2 w-1/2">
							<Label>Model</Label>
							<Select
								value={config.name}
								onValueChange={(value) => updateConfig({ name: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{config.provider && AVAILABLE_MODELS[config.provider]?.map((model) => (
										<SelectItem key={model} value={model}>
											{model}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Temperature */}
					<div className="space-y-2">
						<div className="flex justify-between">
							<Label>Temperature</Label>
							<span className="text-sm text-gray-500">
								{config.parameters?.temperature}
							</span>
						</div>
						<Slider
							value={[config?.parameters?.temperature]}
							min={0}
							max={2}
							step={0.1}
							onValueChange={([value]) =>
								updateConfig({
									parameters: {
										...config.parameters,
										temperature: value,
									},
								})
							}
						/>
					</div>

					{/* Max Tokens */}
					<div className="space-y-2">
						<Label>Max Tokens</Label>
						<Input
							type="number"
							value={config?.parameters?.max_tokens}
							onChange={(e) =>
								updateConfig({
									parameters: {
										...config.parameters,
										max_tokens: Number.parseInt(e.target.value),
									},
								})
							}
							min={1}
							max={32000}
						/>
					</div>

					{/* Top P */}
					<div className="space-y-2">
						<div className="flex justify-between">
							<Label>Top P</Label>
							<span className="text-sm text-gray-500">
								{config?.parameters?.top_p}
							</span>
						</div>
						<Slider
							value={[config.parameters?.top_p]}
							min={0}
							max={1}
							step={0.05}
							onValueChange={([value]) =>
								updateConfig({
									parameters: {
										...config.parameters,
										top_p: value,
									},
								})
							}
						/>
					</div>

					{/* Frequency Penalty */}
					<div className="space-y-2">
						<div className="flex justify-between">
							<Label>Frequency Penalty</Label>
							<span className="text-sm text-gray-500">
								{config?.parameters?.frequency_penalty}
							</span>
						</div>
						<Slider
							value={[config?.parameters?.frequency_penalty]}
							min={-2}
							max={2}
							step={0.1}
							onValueChange={([value]) =>
								updateConfig({
									parameters: {
										...config.parameters,
										frequency_penalty: value,
									},
								})
							}
						/>
					</div>

					{/* Presence Penalty */}
					<div className="space-y-2">
						<div className="flex justify-between">
							<Label>Presence Penalty</Label>
							<span className="text-sm text-gray-500">
								{config?.parameters?.presence_penalty}
							</span>
						</div>
						<Slider
							value={[config?.parameters?.presence_penalty]}
							min={-2}
							max={2}
							step={0.1}
							onValueChange={([value]) =>
								updateConfig({
									parameters: {
										...config.parameters,
										presence_penalty: value,
									},
								})
							}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="default"
						className="gap-2"
						onClick={() => {
							setModelConfig(config);
							saveDraftMutation.mutate(config);
							setOpen(false);
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
