import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Cloud,
	CloudOff,
	ExternalLink,
	Info,
	Plus,
	Shield,
	Zap,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TitleBar from "@/components/ui/title-bar";

interface Tool {
	id: string;
	name: string;
	description: string;
	icon: string;
	
}

const AVAILABLE_TOOLS: Tool[] = [
	{
		id: "get_weather",
		name: "Weather Info",
		description: "Get real-time weather information for any location",
		icon: "🌤️",
		
	},
	{
		id: "get_news",
		name: "News Feed",
		description: "Stay updated with latest news from trusted sources",
		icon: "📰",
		
	},
	{
		id: "get_stock_price",
		name: "Stock Price",
		description: "Track real-time stock market data and prices",
		icon: "📈",
		
	},
];

const ToolsList = () => {
	// In production this would come from env variables
	const isToolsEnabled = false;

	const getStatusColor = (
		status: "pending" | "running" | "completed" | "failed",
	) => {
		switch (status) {
			case "completed":
				return "text-green-500";
			case "running":
				return "text-blue-500";
			case "failed":
				return "text-red-500";
			default:
				return "text-gray-400";
		}
	};

	const getProgressColor = (
		status: "pending" | "running" | "completed" | "failed",
	) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "running":
				return "bg-blue-500";
			case "failed":
				return "bg-red-500";
			default:
				return "bg-gray-200";
		}
	};

	return (
		<div className="h-full flex flex-col bg-white ">
			<TitleBar title="Tools" extra={
				<Button variant="ghost" size="xs" className=" hover:bg-gray-100">
					Docs
					<ExternalLink className="h-4 w-4" />
				</Button>
			} />
			

			{!isToolsEnabled && (
				<div className="px-4 py-3">
					<div className="rounded-md border-b border-gray-200 bg-gray-50">
						<div className="p-3">
							<div className="flex gap-3">
								<Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
								<div className="space-y-2 min-w-0">
									<div>
										<h4 className="text-sm font-medium text-gray-700">
											Tools are currently disabled
										</h4>
										<p className="text-xs text-gray-600 mt-0.5">
											Enable tools locally by following these steps:
										</p>
									</div>
									<ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
										<li className="truncate">Clone the repository locally</li>
										<li className="truncate">
											Create{" "}
											<code className="px-1 py-0.5 rounded bg-gray-100 font-mono">
												.env
											</code>{" "}
											file
										</li>
										<li className="truncate">
											Add{" "}
											<code className="px-1 py-0.5 rounded bg-gray-100 font-mono">
												ENABLE_TOOLS=true
											</code>
										</li>
										<li className="truncate">Restart the development server</li>
									</ol>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-auto ">
				<div className="space-y-2 w-full">
					{AVAILABLE_TOOLS.map((tool) => (
						<div
							key={tool.id}
							className="group border-b border-gray-200 bg-white p-3 hover:bg-gray-50 w-full"
						>
							<div className="flex items-start gap-3 w-full">
								<div className="relative flex-shrink-0">
									<div className="flex h-8 w-8 items-center justify-center rounded bg-gray-50 text-lg">
										{tool.icon}
									</div>
									<div className="absolute -right-0.5 -top-0.5">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													{isToolsEnabled ? (
														<div className="rounded-full border border-white bg-white p-0.5">
															<Cloud className="w-2.5 h-2.5 text-green-500" />
														</div>
													) : (
														<div className="rounded-full border border-white bg-white p-0.5">
															<CloudOff className="w-2.5 h-2.5 text-gray-300" />
														</div>
													)}
												</TooltipTrigger>
												<TooltipContent side="top">
													<p className="text-xs">
														{isToolsEnabled
															? "Available"
															: "Currently disabled"}
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</div>
								<div className="min-w-0 flex-1 space-y-2">
									<div>
										<div className="flex items-center gap-2 mb-0.5">
											<h4 className="text-sm font-medium text-gray-900 truncate">
												{tool.name}
											</h4>
										</div>
										<p className="text-xs text-gray-500 truncate">
											{tool.description}
										</p>
									</div>
							
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ToolsList;
