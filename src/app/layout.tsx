import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "LeadMaster - Mobile Lead Management",
	description: "Mobile-optimized lead management platform",
	viewport:
		"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
	themeColor: "#3b82f6",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "LeadMaster",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<style>{`
html {
  --font-sans: Inter, sans-serif;
}
        `}</style>
				<meta name='mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='default'
				/>
				<meta name='format-detection' content='telephone=no' />
			</head>
			<body className='mobile-scroll'>{children}</body>
		</html>
	);
}
