import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center p-8 text-center",
				className,
			)}
		>
			{icon && <div className="mb-4">{icon}</div>}
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
			{action && (
				<Button onClick={action.onClick} className="min-w-[120px]">
					{action.label}
				</Button>
			)}
		</div>
	);
}

// SVG Icons for different empty states
export const EmptyStateIcons = {
	Database: () => (
		<div className="w-16 h-16 mx-auto mb-4 text-gray-300">
			<svg
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<title>Database</title>
				<path
					d="M32 8C23.163 8 16 11.686 16 16v32c0 4.314 7.163 8 16 8s16-3.686 16-8V16c0-4.314-7.163-8-16-8z"
					fill="currentColor"
					opacity="0.1"
				/>
				<ellipse
					cx="32"
					cy="16"
					rx="16"
					ry="8"
					fill="currentColor"
					opacity="0.2"
				/>
				<ellipse
					cx="32"
					cy="24"
					rx="16"
					ry="8"
					fill="currentColor"
					opacity="0.15"
				/>
				<ellipse
					cx="32"
					cy="32"
					rx="16"
					ry="8"
					fill="currentColor"
					opacity="0.1"
				/>
				<path
					d="M16 16v32c0 4.314 7.163 8 16 8s16-3.686 16-8V16"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<ellipse
					cx="32"
					cy="16"
					rx="16"
					ry="8"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<ellipse
					cx="32"
					cy="24"
					rx="16"
					ry="8"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<ellipse
					cx="32"
					cy="32"
					rx="16"
					ry="8"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
			</svg>
		</div>
	),
	Search: () => (
		<div className="w-16 h-16 mx-auto mb-4 text-gray-300">
			<svg
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<title>Search</title>
				<circle
					cx="26"
					cy="26"
					r="18"
					fill="currentColor"
					opacity="0.1"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="m40 40 16 16"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<circle cx="26" cy="26" r="4" fill="currentColor" opacity="0.3" />
				<path
					d="M32 20a6 6 0 0 0-6 6"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					opacity="0.5"
				/>
			</svg>
		</div>
	),
	Folder: () => (
		<div className="w-16 h-16 mx-auto mb-4 text-gray-300">
			<svg
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<title>Folder</title>
				<path
					d="M8 16h20l4 4h24v32H8V16z"
					fill="currentColor"
					opacity="0.1"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<path d="M8 20h48v28H8z" fill="currentColor" opacity="0.05" />
				<circle cx="32" cy="34" r="3" fill="currentColor" opacity="0.3" />
				<path
					d="M28 38h8"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					opacity="0.4"
				/>
			</svg>
		</div>
	),
	Prompt: () => (
		<div className="w-16 h-16 mx-auto mb-4 text-gray-300">
			<svg
				viewBox="0 0 64 64"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<title>Prompt</title>
				<rect
					x="8"
					y="12"
					width="48"
					height="40"
					rx="4"
					fill="currentColor"
					opacity="0.1"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path d="M8 20h48" stroke="currentColor" strokeWidth="2" />
				<circle cx="14" cy="16" r="2" fill="currentColor" opacity="0.3" />
				<circle cx="20" cy="16" r="2" fill="currentColor" opacity="0.3" />
				<circle cx="26" cy="16" r="2" fill="currentColor" opacity="0.3" />
				<path
					d="M16 28h32M16 34h24M16 40h28"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					opacity="0.4"
				/>
				<path
					d="M44 28l4 4-4 4"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity="0.6"
				/>
			</svg>
		</div>
	),
};
