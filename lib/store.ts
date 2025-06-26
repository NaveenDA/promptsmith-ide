import { atom } from "jotai";
import { z } from "zod";
import { sample_prompts } from "./sample-db";

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

// Define default config
const defaultConfig: ModelConfig = {
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
};

// Create atoms
export const modelConfigAtom = atom<ModelConfig>(defaultConfig);

// Derived atoms for specific updates
export const modelParametersAtom = atom(
	(get) => get(modelConfigAtom).parameters,
	(get, set, newParameters: Partial<ModelParameters>) => {
		const currentConfig = get(modelConfigAtom);
		set(modelConfigAtom, {
			...currentConfig,
			parameters: { ...currentConfig.parameters, ...newParameters },
		});
	}
);

export const selectedActivityBarTabAtom = atom<"prompts" | "database" | "tools">("prompts");

export const selectedPromptIdAtom = atom<string | null>(null);

export const currentPromptAtom = atom((get) => {
	const selectedId = get(selectedPromptIdAtom);
	return sample_prompts.find((p) => p.id === selectedId) || null;
});
