import { create } from "zustand";
import { z } from "zod";

// Define model parameters schema
export const ModelParametersSchema = z.object({
	temperature: z.number().min(0).max(2).default(0.7),
	max_tokens: z.number().min(1).max(32000).default(2000),
	top_p: z.number().min(0).max(1).default(1),
	frequency_penalty: z.number().min(-2).max(2).default(0),
	presence_penalty: z.number().min(-2).max(2).default(0),
	stop: z.array(z.string()).optional(),
	stream: z.boolean().default(true),
});

export type ModelParameters = z.infer<typeof ModelParametersSchema>;

// Define available models for each provider
export const AVAILABLE_MODELS = {
	OpenAI: ["gpt-4", "gpt-4-turbo-preview", "gpt-3.5-turbo"],
	Anthropic: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
	Cohere: ["command", "command-light", "command-nightly"],
	Mistral: ["mistral-large", "mistral-medium", "mistral-small"],
	Perplexity: [
		"pplx-7b-online",
		"pplx-70b-online",
		"pplx-7b-chat",
		"pplx-70b-chat",
	],
	DeepSeek: ["deepseek-coder", "deepseek-chat", "deepseek-math"],
} as const;

// Define model configuration schema
export const ModelConfigSchema = z.object({
	provider: z.enum([
		"OpenAI",
		"Anthropic",
		"Cohere",
		"Mistral",
		"Perplexity",
		"DeepSeek",
	]),
	name: z.string(),
	parameters: ModelParametersSchema,
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

// Define store
interface ModelStore {
	config: ModelConfig;
	setConfig: (config: Partial<ModelConfig>) => void;
	setParameters: (parameters: Partial<ModelParameters>) => void;
}

// Create store
export const useModelStore = create<ModelStore>((set) => ({
	config: {
		provider: "OpenAI",
		name: "gpt-4",
		parameters: {
			temperature: 0.7,
			max_tokens: 2000,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stream: true,
		},
	},
	setConfig: (newConfig) =>
		set((state) => ({
			config: { ...state.config, ...newConfig },
		})),
	setParameters: (newParameters) =>
		set((state) => ({
			config: {
				...state.config,
				parameters: { ...state.config.parameters, ...newParameters },
			},
		})),
}));
