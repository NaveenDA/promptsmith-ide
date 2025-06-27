"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Eye, EyeOff, Key, Cloud, HardDrive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

interface ApiKeyConfig {
	id: string;
	name: string;
	key: string;
	docLink: string;
	getKeyLink: string;
}

const API_PROVIDERS: ApiKeyConfig[] = [
	{
		id: "openai",
		name: "OpenAI",

		key: "",
		docLink: "https://platform.openai.com/docs/api-reference",
		getKeyLink: "https://platform.openai.com/api-keys",
	},
	{
		id: "anthropic",
		name: "Anthropic",
		key: "",
		docLink: "https://docs.anthropic.com/claude/reference",
		getKeyLink: "https://console.anthropic.com/account/keys",
	},
	{
		id: "cohere",
		name: "Cohere",
		key: "",
		docLink: "https://docs.cohere.com/reference",
		getKeyLink: "https://dashboard.cohere.com/api-keys",
	},
	{
		id: "mistral",
		name: "Mistral AI",
		key: "",
		docLink: "https://docs.mistral.ai/api",
		getKeyLink: "https://console.mistral.ai/api-keys",
	},
	{
		id: "perplexity",
		name: "Perplexity AI",
		key: "",
		docLink: "https://docs.perplexity.ai",
		getKeyLink: "https://www.perplexity.ai/settings/api",
	},
	// deepseek r1
	{
		id: "deepseek",
		name: "DeepSeek",
		key: "",
		docLink: "https://api-docs.deepseek.com",
		getKeyLink: "https://platform.deepseek.com/api_keys",
	},
];

export function ApiKeysDialog() {
	const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
		if (typeof window !== "undefined") {
			const savedKeys = localStorage.getItem("api_keys");
			return savedKeys ? JSON.parse(savedKeys) : {};
		}
		return {};
	});

	const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
	const [useSecureSync, setUseSecureSync] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("use_secure_sync") === "true";
		}
		return false;
	});

	const handleKeyChange = (providerId: string, value: string) => {
		const newKeys = { ...apiKeys, [providerId]: value };
		setApiKeys(newKeys);

		if (useSecureSync) {
			// TODO: Implement server-side storage
			// This would make an API call to store the keys securely
			console.log("Storing keys on server...");
		} else {
			localStorage.setItem("api_keys", JSON.stringify(newKeys));
		}
	};

	const toggleKeyVisibility = (providerId: string) => {
		setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
	};

	const handleStoragePreferenceChange = (checked: boolean) => {
		setUseSecureSync(checked);
		localStorage.setItem("use_secure_sync", checked.toString());

		if (checked) {
			// TODO: Implement migration to server storage
			console.log("Migrating keys to server storage...");
		} else {
			// TODO: Implement migration to local storage
			console.log("Migrating keys to local storage...");
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Key className="w-4 h-4" />
					API Keys
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>API Keys Management</DialogTitle>
					<DialogDescription>Manage your API keys securely</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-muted/50">
						<div className="space-y-0.5">
							<div className="text-sm font-medium">Storage Preference</div>
							<div className="text-xs text-muted-foreground">
								Choose how you want to store your API keys
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<HardDrive className="w-4 h-4 text-muted-foreground" />
							<Switch
								checked={useSecureSync}
								onCheckedChange={handleStoragePreferenceChange}
							/>
							<Cloud className="w-4 h-4 text-muted-foreground" />
						</div>
					</div>

					<div className="text-xs space-y-2">
						{useSecureSync ? (
							<>
								<p className="font-medium">
									Using Secure Sync (Server Storage)
								</p>
								<ul className="list-disc list-inside space-y-1 text-muted-foreground">
									<li>Keys are encrypted and stored securely on our servers</li>
									<li>
										Access your keys across different devices and browsers
									</li>
									<li>Enterprise-grade security with regular audits</li>
									<li>Automatic backup and recovery</li>
								</ul>
							</>
						) : (
							<>
								<p className="font-medium">
									Using Local Storage (Browser Storage)
								</p>
								<ul className="list-disc list-inside space-y-1 text-muted-foreground">
									<li>
										Keys are stored only in your browser&apos;s local storage
									</li>
									<li>Keys never leave your device</li>
									<li>
										Need to re-enter keys when using different browsers or
										devices
									</li>
									<li>Keys are cleared when browser data is cleared</li>
								</ul>
							</>
						)}
					</div>
				</div>

				<div className="space-y-6 py-4">
					{API_PROVIDERS.map((provider) => (
						<div key={provider.id} className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Image
										src={`/logos/${provider.id}.svg`}
										alt={provider.name}
										width={20}
										height={20}
									/>
									<span className="font-medium">{provider.name}</span>
									<a
										href={provider.docLink}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-muted-foreground hover:text-foreground"
									>
										<ExternalLink className="w-3 h-3" />
									</a>
								</div>
								<a
									href={provider.getKeyLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-blue-500 hover:text-blue-600"
								>
									Get Key
								</a>
							</div>
							<div className="flex gap-2">
								<Input
									type={showKeys[provider.id] ? "text" : "password"}
									placeholder={`Enter ${provider.name} API key`}
									value={apiKeys[provider.id] || ""}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleKeyChange(provider.id, e.target.value)
									}
									className="font-mono"
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() => toggleKeyVisibility(provider.id)}
								>
									{showKeys[provider.id] ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
