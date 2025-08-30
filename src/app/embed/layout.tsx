import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
	title: "Lead Form - Leads Master",
	description: "Embeddable lead collection form",
};

export default function EmbedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className={`font-sans ${GeistSans.variable}`}>{children}</div>
		</>
	);
}
