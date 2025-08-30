import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	FileText,
	Code,
	Settings,
	BarChart3,
	ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-6'>
						<h1 className='text-2xl font-bold text-gray-900'>
							Leads Master
						</h1>
						<div className='flex items-center space-x-4'>
							<span className='text-sm text-gray-500'>
								Welcome, Admin
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold text-gray-900 mb-4'>
						Manage Your Lead Collection System
					</h2>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
						Access all the tools you need to collect, manage, and
						export leads from your business loan applications.
					</p>
				</div>

				{/* Navigation Cards */}
				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
					{/* Admin Panel */}
					<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
									<Users className='h-6 w-6 text-blue-600' />
								</div>
								<ExternalLink className='h-4 w-4 text-gray-400' />
							</div>
							<CardTitle className='text-lg'>
								Admin Panel
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 text-sm mb-4'>
								View, manage, and export all collected leads.
								Mark leads as completed and filter by date
								ranges.
							</p>
							<Button
								asChild
								className='w-full bg-blue-600 hover:bg-blue-700'>
								<Link href='/admin'>Go to Admin Panel</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Lead Form */}
					<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
									<FileText className='h-6 w-6 text-green-600' />
								</div>
								<ExternalLink className='h-4 w-4 text-gray-400' />
							</div>
							<CardTitle className='text-lg'>Lead Form</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 text-sm mb-4'>
								Test the lead collection form that visitors will
								use to submit their loan applications.
							</p>
							<Button
								asChild
								variant='outline'
								className='w-full'>
								<Link href='/embed'>View Lead Form</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Embed Code */}
					<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
									<Code className='h-6 w-6 text-purple-600' />
								</div>
								<ExternalLink className='h-4 w-4 text-gray-400' />
							</div>
							<CardTitle className='text-lg'>
								Embed Code
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 text-sm mb-4'>
								Get embed codes to add the lead form to your
								WordPress site or any other website.
							</p>
							<Button
								asChild
								variant='outline'
								className='w-full'>
								<Link href='/embed-code'>Get Embed Codes</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Analytics */}
					<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
									<BarChart3 className='h-6 w-6 text-orange-600' />
								</div>
								<ExternalLink className='h-4 w-4 text-gray-400' />
							</div>
							<CardTitle className='text-lg'>Analytics</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 text-sm mb-4'>
								View lead collection statistics and performance
								metrics for your campaigns.
							</p>
							<Button
								asChild
								variant='outline'
								className='w-full'
								disabled>
								<Link href='#'>Coming Soon</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Settings */}
					<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
									<Settings className='h-6 w-6 text-gray-600' />
								</div>
								<ExternalLink className='h-4 w-4 text-gray-400' />
							</div>
							<CardTitle className='text-lg'>Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-gray-600 text-sm mb-4'>
								Configure your lead collection system, API keys,
								and notification preferences.
							</p>
							<Button
								asChild
								variant='outline'
								className='w-full'
								disabled>
								<Link href='#'>Coming Soon</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Quick Stats */}
				<Card className='bg-white'>
					<CardHeader>
						<CardTitle className='text-lg'>
							Quick Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
							<div className='text-center'>
								<div className='text-2xl font-bold text-blue-600'>
									3
								</div>
								<div className='text-sm text-gray-600'>
									Active Pages
								</div>
							</div>
							<div className='text-center'>
								<div className='text-2xl font-bold text-green-600'>
									2
								</div>
								<div className='text-sm text-gray-600'>
									Embed Methods
								</div>
							</div>
							<div className='text-center'>
								<div className='text-2xl font-bold text-purple-600'>
									1
								</div>
								<div className='text-sm text-gray-600'>
									API Endpoint
								</div>
							</div>
							<div className='text-center'>
								<div className='text-2xl font-bold text-orange-600'>
									24h
								</div>
								<div className='text-sm text-gray-600'>
									Response Time
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Footer */}
			<footer className='bg-white border-t border-gray-200 mt-10'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='text-center text-gray-500'>
						<p>
							&copy; 2025 Leads Master. Built by{" "}
							<Link
								href='https://dheeru.org'
								className='text-blue-600 hover:text-blue-800'>
								Dheeru
							</Link>{" "}
							for lead collection and management.
						</p>
						<p className='mt-2 text-sm'>
							<Link
								href='/admin'
								className='text-blue-600 hover:text-blue-800'>
								Admin Panel
							</Link>{" "}
							•
							<Link
								href='/embed'
								className='text-blue-600 hover:text-blue-800 ml-4'>
								Lead Form
							</Link>{" "}
							•
							<Link
								href='/embed-code'
								className='text-blue-600 hover:text-blue-800 ml-4'>
								Embed Codes
							</Link>
						</p>
					</div>
				</div>
			</footer>
		</main>
	);
}
