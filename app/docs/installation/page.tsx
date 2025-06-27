import { Badge } from "@/components/ui/badge";

export default function InstallationPage() {
	return (
		<div className="prose prose-gray dark:prose-invert max-w-none">
			<h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6 border-b pb-4">
				Installation Guide
			</h1>

			<p className="leading-7 text-lg mb-6">
				Get PromptSmith IDE up and running in minutes with our comprehensive
				installation guide.
			</p>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4">
				System Requirements
			</h2>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Before installing PromptSmith IDE, ensure your system meets the
				following requirements:
			</p>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
				Minimum Requirements
			</h3>
			<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
				<li className="leading-7">
					<strong>OS</strong>: Windows 10, macOS 10.15+, or Linux (Ubuntu
					18.04+)
				</li>
				<li className="leading-7">
					<strong>RAM</strong>: 4GB minimum, 8GB recommended
				</li>
				<li className="leading-7">
					<strong>Storage</strong>: 2GB available space
				</li>
				<li className="leading-7">
					<strong>Node.js</strong>: Version 18.0 or higher
				</li>
			</ul>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4">
				Installation Methods
			</h2>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
				Option 1: Docker <Badge variant="secondary">Recommended</Badge>
			</h3>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				The easiest way to get started is using Docker:
			</p>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					{`# Pull the latest image
docker pull promptsmith/ide:latest

# Run the container
docker run -d \\
  --name promptsmith-ide \\
  -p 3000:3000 \\
  -v $(pwd)/data:/app/data \\
  promptsmith/ide:latest`}
				</code>
			</pre>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Access the application at <code>http://localhost:3000</code>
			</p>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
				Option 2: npm/yarn Installation
			</h3>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Install PromptSmith IDE globally using npm or yarn:
			</p>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					{`# Using npm
npm install -g @promptsmith/ide

# Using yarn
yarn global add @promptsmith/ide

# Start the application
promptsmith-ide start`}
				</code>
			</pre>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4">
				Environment Configuration
			</h2>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Create a <code>.env.local</code> file with the following variables:
			</p>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					{`# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/promptsmith"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI Model API Keys (Optional - can be configured in UI)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_API_KEY="..."

# Vector Database (Optional)
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."`}
				</code>
			</pre>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4">
				Verification
			</h2>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				After installation, verify everything is working:
			</p>

			<ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li className="leading-7">
					<strong>Access the application</strong> at the configured URL
				</li>
				<li className="leading-7">
					<strong>Create an account</strong> or sign in
				</li>
				<li className="leading-7">
					<strong>Check the health endpoint</strong>: <code>GET /api/health</code>
				</li>
				<li className="leading-7">
					<strong>Test API key configuration</strong> in the settings
				</li>
			</ol>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
				Health Check Response
			</h3>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				A successful health check should return:
			</p>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					{`{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "services": {
    "auth": "operational",
    "vector_db": "operational"
  }
}`}
				</code>
			</pre>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4">
				Troubleshooting
			</h2>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
				Common Issues
			</h3>

			<h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
				Port Already in Use
			</h4>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					Error: listen EADDRINUSE: address already in use :::3000
				</code>
			</pre>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				<strong>Solution</strong>: Change the port in your configuration or kill
				the process using port 3000:
			</p>

			<pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted px-4 py-4">
				<code className="relative rounded bg-muted font-mono text-sm">
					{`# Find the process
lsof -i :3000

# Kill the process
kill -9 <PID>`}
				</code>
			</pre>

			<div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-8">
				<h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">
					🎉 Installation Complete!
				</h3>
				<p className="text-green-700 dark:text-green-300 text-sm">
					Once installation is complete, check out our{" "}
					<a
						href="/docs/quick-start"
						className="font-medium underline underline-offset-4"
					>
						Quick Start Guide
					</a>{" "}
					to create your first prompt.
				</p>
			</div>
		</div>
	);
} 