import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
	return (
		<nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
			<div className="flex items-center gap-2">
				<Image src="/logo.svg" alt="PromptSmith IDE" width={132} height={32} />
			</div>
			<Link
				href="/app"
				className="w-32 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-40 text-center dark:bg-white dark:text-black dark:hover:bg-gray-200"
			>
				Launch IDE
			</Link>
		</nav>
	);
};

const HeroSections = () => {
	return (
		<div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
			<Navbar />
			<div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="px-4 py-10 md:py-20">
				<h1 className="relative z-10 mx-auto max-w-5xl text-center text-3xl font-bold text-slate-700 md:text-5xl lg:text-7xl dark:text-slate-300">
					{"The Ultimate IDE for Prompt Engineering"
						.split(" ")
						.map((word, index) => (
							<motion.span
								// biome-ignore lint/suspicious/noArrayIndexKey: this is fine, since it is just a title
								key={index}
								initial={{
									opacity: 0,
									filter: "blur(4px)",
									y: 10,
								}}
								animate={{
									opacity: 1,
									filter: "blur(0px)",
									y: 0,
								}}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: "easeInOut",
								}}
								className="mr-2 inline-block"
							>
								{word}
							</motion.span>
						))}
				</h1>
				<motion.p
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 0.8,
					}}
					className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
				>
					Build production-ready prompts with{" "}
					<span className="font-semibold text-blue-600 dark:text-blue-400">
						security analysis
					</span>
					,
					<span className="font-semibold text-purple-600 dark:text-purple-400">
						{" "}
						multi-model testing
					</span>
					, and
					<span className="font-semibold text-green-600 dark:text-green-400">
						{" "}
						AI-powered linting
					</span>
					. Completely free, open source, and built for developers who demand
					precision.
				</motion.p>

				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 1,
					}}
					className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
				>
					<Link
						href="/app"
						className="group relative w-60 transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
					>
						<span className="relative z-10">Start Building - Free</span>
						<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</Link>
					<a
						href="https://github.com/promptsmith-ide/promptsmith-ide"
						target="_blank"
						rel="noopener noreferrer"
						className="w-60 transform rounded-lg border border-gray-300 bg-white px-8 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900 text-center"
					>
						View on GitHub
					</a>
				</motion.div>

				<motion.div
					initial={{
						opacity: 0,
						y: 10,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.3,
						delay: 1.1,
					}}
					className="relative z-10 mt-6 flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400"
				>
					<div className="flex items-center gap-2">
						<div className="size-2 rounded-full bg-green-500" />
						<span>100% Free</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="size-2 rounded-full bg-blue-500" />
						<span>Open Source</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="size-2 rounded-full bg-purple-500" />
						<span>Quick Sign Up</span>
					</div>
				</motion.div>

				<motion.div
					initial={{
						opacity: 0,
						y: 10,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.3,
						delay: 1.2,
					}}
					className="relative z-10 mt-16 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
						<div className="aspect-[16/10] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
							{/* Mock IDE Interface */}
							<div className="h-full rounded-lg bg-slate-800 p-4">
								<div className="flex items-center gap-2 mb-4">
									<div className="size-3 rounded-full bg-red-500" />
									<div className="size-3 rounded-full bg-yellow-500" />
									<div className="size-3 rounded-full bg-green-500" />
									<span className="text-gray-400 text-sm ml-4">
										PromptSmith IDE - Security Analysis
									</span>
								</div>
								<div className="grid grid-cols-3 gap-4 h-full">
									<div className="bg-slate-700 rounded p-3">
										<div className="text-green-400 text-xs mb-2">
											✓ Prompt Editor
										</div>
										<div className="text-gray-300 text-xs">
											Live syntax highlighting
										</div>
									</div>
									<div className="bg-slate-700 rounded p-3">
										<div className="text-yellow-400 text-xs mb-2">
											⚠ Security Check
										</div>
										<div className="text-gray-300 text-xs">
											Injection detection
										</div>
									</div>
									<div className="bg-slate-700 rounded p-3">
										<div className="text-blue-400 text-xs mb-2">
											🔄 Multi-Model
										</div>
										<div className="text-gray-300 text-xs">
											OpenAI, Claude, Mistral
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default HeroSections;
