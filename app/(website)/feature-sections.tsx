import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function FeatureSections() {
	return (
		<div className="py-20 bg-neutral-50 dark:bg-neutral-900">
			<div className="mx-auto max-w-7xl px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
						Why PromptSmith IDE?
					</h2>
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
						Because &quot;just writing prompts&quot; isn&apos;t enough anymore.
						You need analysis, simulation, security, and speed — all in one
						place.
					</p>
				</div>

				<div className="grid max-w-6xl mx-auto grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Security Analysis */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">🛡️</div>
								<div className="text-sm font-semibold text-red-600 dark:text-red-400">
									SECURITY FIRST
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							Built-in
							<PointerHighlight
								rectangleClassName="bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 leading-loose"
								pointerClassName="text-red-500 h-3 w-3"
								containerClassName="inline-block mx-1"
							>
								<span className="relative z-10">Security Analysis</span>
							</PointerHighlight>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Get real-time alerts on prompt injection risks and overrides.
							Dynamic test cases catch vulnerabilities before they reach
							production.
						</p>
					</div>

					{/* Multi-Model Testing */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">🔄</div>
								<div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
									MULTI-MODEL
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							<PointerHighlight
								rectangleClassName="bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 leading-loose"
								pointerClassName="text-blue-500 h-3 w-3"
								containerClassName="inline-block mr-1"
							>
								<span className="relative z-10">Multi-Model Testing</span>
							</PointerHighlight>
							Made Easy
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Seamlessly evaluate across OpenAI, Claude, Mistral, Perplexity,
							and more. Compare outputs, analyze performance, and choose the
							best model for your use case.
						</p>
					</div>

					{/* AI-Powered Linting */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">🧪</div>
								<div className="text-sm font-semibold text-green-600 dark:text-green-400">
									AI POWERED
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							<PointerHighlight
								rectangleClassName="bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 leading-loose"
								pointerClassName="text-green-500 h-3 w-3"
								containerClassName="inline-block mr-1"
							>
								<span className="relative z-10">Smart Linting</span>
							</PointerHighlight>
							& Analysis
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Catch issues like vague roles, excessive temperature, missing
							delimiters, and prompt anti-patterns before they impact your
							results.
						</p>
					</div>
				</div>

				{/* Additional Features Row */}
				<div className="grid max-w-6xl mx-auto grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
					{/* Live Editor */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">🧰</div>
								<div className="text-sm font-semibold text-violet-600 dark:text-violet-400">
									LIVE EDITING
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							Professional
							<PointerHighlight
								rectangleClassName="bg-violet-100 dark:bg-violet-900/50 border-violet-300 dark:border-violet-700 leading-loose"
								pointerClassName="text-violet-500 h-3 w-3"
								containerClassName="inline-block mx-1"
							>
								<span className="relative z-10">Prompt Editor</span>
							</PointerHighlight>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Write and debug prompts with syntax-aware editing,
							auto-formatting, structured templates, and intelligent
							autocomplete.
						</p>
					</div>

					{/* Version Control */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">📁</div>
								<div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
									VERSION CONTROL
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							<PointerHighlight
								rectangleClassName="bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 leading-loose"
								pointerClassName="text-amber-500 h-3 w-3"
								containerClassName="inline-block mr-1"
							>
								<span className="relative z-10">Versioned Management</span>
							</PointerHighlight>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Fork, store, and share prompts with full version control and team
							collaboration. Never lose a working prompt again.
						</p>
					</div>

					{/* Open Source */}
					<div className="rounded-xl p-8 bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
						<div className="h-48 w-full rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-6">
							<div className="text-center">
								<div className="text-4xl mb-2">🔓</div>
								<div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
									100% FREE
								</div>
							</div>
						</div>
						<div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-4">
							<PointerHighlight
								rectangleClassName="bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700 leading-loose"
								pointerClassName="text-teal-500 h-3 w-3"
								containerClassName="inline-block mr-1"
							>
								<span className="relative z-10">Open Source</span>
							</PointerHighlight>
							& Extensible
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Built for developers. Contribute, self-host, or extend it to fit
							your stack. No vendor lock-in, no hidden costs, ever.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
