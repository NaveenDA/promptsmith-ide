import "./globals.css";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Promptsmith IDE",
	description: "A professional IDE for prompt engineering",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<TooltipProvider>
					{children}
				</TooltipProvider>
			</body>
		</html>
	);
}
