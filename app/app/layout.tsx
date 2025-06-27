import Header from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<TooltipProvider>
				<Header />
				{children}
			</TooltipProvider>
		</>
	);
}
