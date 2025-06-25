import "./globals.css";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import Head from "next/head";

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
				<Head>
					<meta name="apple-mobile-web-app-title" content="Prompt Smith IDE" />
				</Head>

				<TooltipProvider>
					{children}
				</TooltipProvider>
			</body>
		</html>
	);
}
