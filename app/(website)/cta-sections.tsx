import Link from "next/link";

export default function CTASections() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 border border-blue-100 dark:border-blue-900">
          {/* Background Pattern */}
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle r={512} cx={512} cy={512} fill="url(#gradient)" fillOpacity="0.3" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#3B82F6" />
                <stop offset={1} stopColor="#8B5CF6" />
              </radialGradient>
            </defs>
          </svg>

          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-4xl font-bold tracking-tight text-balance text-gray-900 dark:text-white sm:text-5xl">
              Ready to Build Secure Prompts?
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-gray-700 dark:text-gray-200">
              Join thousands of developers using PromptSmith IDE to create production-ready prompts with built-in security analysis, multi-model testing, and AI-powered optimization. 
              <span className="font-semibold text-blue-700 dark:text-blue-300"> Sign up in seconds and start building.</span>
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-green-700 dark:text-green-300 text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-time security analysis & injection detection
              </div>
              <div className="flex items-center text-blue-700 dark:text-blue-300 text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Test across OpenAI, Claude, Mistral, and more
              </div>
              <div className="flex items-center text-purple-700 dark:text-purple-300 text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completely free with full access to all features
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                href="/app"
                className="group relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign Up & Start Building
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <a 
                href="https://github.com/promptsmith-ide/promptsmith-ide" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-base font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors duration-300"
              >
                View Source Code
                <span className="ml-1">↗</span>
              </a>
            </div>

            <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">
              <strong>Join 10,000+ developers</strong> building secure prompts with PromptSmith IDE
            </div>
          </div>

          {/* Right side - Mock dashboard/stats */}
          <div className="relative mt-16 h-80 lg:mt-8 lg:w-1/2">
            <div className="absolute top-0 left-0 w-full max-w-none rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-600 p-6 shadow-lg">
              <div className="text-gray-900 dark:text-white text-sm font-semibold mb-4">Security Dashboard</div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Injection Attempts Blocked</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Models Tested</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Prompts Analyzed</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">1,432</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Security Score</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">98.7%</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                ✓ Real-time analysis • ✓ Zero false positives • ✓ Production ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  