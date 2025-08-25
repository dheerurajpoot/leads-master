"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { Zap, LogOut, UserIcon, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
	user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
	const router = useRouter();
	const [isExporting, setIsExporting] = useState(false);

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/");
	};

	const handleExportLeads = async () => {
		setIsExporting(true);
		try {
			const response = await fetch("/api/export-leads");

			if (!response.ok) {
				throw new Error("Export failed");
			}

			// Create download link
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `leadmaster-leads-${
				new Date().toISOString().split("T")[0]
			}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Export error:", error);
			alert("Failed to export leads. Please try again.");
		} finally {
			setIsExporting(false);
		}
	};

	const getInitials = (email: string) => {
		return email.substring(0, 2).toUpperCase();
	};

	return (
		<header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-4 max-w-7xl'>
				<div className='flex items-center justify-between'>
					<Link
						href='/dashboard'
						className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
							<Zap className='w-5 h-5 text-white' />
						</div>
						<span className='text-xl font-bold text-gray-900'>
							LeadMaster
						</span>
					</Link>

					<div className='flex items-center space-x-4'>
						<Button
							variant='outline'
							className='bg-transparent'
							onClick={handleExportLeads}
							disabled={isExporting}>
							<Download className='w-4 h-4 mr-2' />
							{isExporting ? "Exporting..." : "Export Leads"}
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									className='relative h-10 w-10 rounded-full'>
									<Avatar className='h-10 w-10'>
										<AvatarFallback className='bg-blue-100 text-blue-600 font-medium'>
											{getInitials(user.email || "")}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-56'
								align='end'
								forceMount>
								<div className='flex flex-col space-y-1 p-2'>
									<p className='text-sm font-medium leading-none'>
										{user.user_metadata?.full_name ||
											"Team Member"}
									</p>
									<p className='text-xs leading-none text-muted-foreground'>
										{user.email}
									</p>
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<UserIcon className='mr-2 h-4 w-4' />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className='mr-2 h-4 w-4' />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
