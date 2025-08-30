import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Clock } from "lucide-react";

export default function Page() {
	return (
		<main className='min-h-screen'>
			{/* Hero Section */}
			<section className='bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4'>
				<div className='mx-auto max-w-6xl text-center'>
					<div className='mb-6'>
						<span className='inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800'>
							<TrendingUp className='mr-2 h-4 w-4' />
							Fast Approval Process
						</span>
					</div>
					<h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
						Business Loans That
						<span className='text-blue-600 block'>
							Work for You
						</span>
					</h1>
					<p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
						Get the capital you need to grow your business with our
						streamlined application process. Quick approvals,
						competitive rates, and flexible terms.
					</p>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-20 px-4 bg-white'>
				<div className='mx-auto max-w-6xl'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							Why Choose Our Business Loans?
						</h2>
						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
							We&apos;ve simplified the lending process to get you
							the funds you need quickly and efficiently.
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						<Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
							<CardContent className='p-8 text-center'>
								<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Clock className='h-8 w-8 text-blue-600' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-3'>
									Quick Approval
								</h3>
								<p className='text-gray-600'>
									Get approved in as little as 24 hours with
									our streamlined process.
								</p>
							</CardContent>
						</Card>

						<Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
							<CardContent className='p-8 text-center'>
								<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Shield className='h-8 w-8 text-green-600' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-3'>
									Flexible Terms
								</h3>
								<p className='text-gray-600'>
									Customizable repayment schedules that fit
									your business cash flow.
								</p>
							</CardContent>
						</Card>

						<Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
							<CardContent className='p-8 text-center'>
								<div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<TrendingUp className='h-8 w-8 text-purple-600' />
								</div>
								<h3 className='text-xl font-semibold text-gray-900 mb-3'>
									Competitive Rates
								</h3>
								<p className='text-gray-600'>
									Industry-leading interest rates starting
									from 8.99% APR.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='py-20 px-4 bg-gray-50'>
				<div className='mx-auto max-w-6xl'>
					<div className='grid md:grid-cols-4 gap-8 text-center'>
						<div>
							<div className='text-4xl font-bold text-blue-600 mb-2'>
								₹50Cr+
							</div>
							<div className='text-gray-600'>Funds Disbursed</div>
						</div>
						<div>
							<div className='text-4xl font-bold text-blue-600 mb-2'>
								5000+
							</div>
							<div className='text-gray-600'>
								Businesses Funded
							</div>
						</div>
						<div>
							<div className='text-4xl font-bold text-blue-600 mb-2'>
								24hrs
							</div>
							<div className='text-gray-600'>
								Average Approval
							</div>
						</div>
						<div>
							<div className='text-4xl font-bold text-blue-600 mb-2'>
								98%
							</div>
							<div className='text-gray-600'>
								Customer Satisfaction
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className='py-20 px-4 bg-white'>
				<div className='mx-auto max-w-6xl'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							How It Works
						</h2>
						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
							Get your business loan in three simple steps
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold'>
								1
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Apply Online
							</h3>
							<p className='text-gray-600'>
								Fill out our simple application form in just 5
								minutes.
							</p>
						</div>
						<div className='text-center'>
							<div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold'>
								2
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Quick Review
							</h3>
							<p className='text-gray-600'>
								Our team reviews your application within 24
								hours.
							</p>
						</div>
						<div className='text-center'>
							<div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold'>
								3
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3'>
								Get Funded
							</h3>
							<p className='text-gray-600'>
								Receive your funds directly to your business
								account.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 px-4 bg-blue-600'>
				<div className='mx-auto max-w-4xl text-center'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
						Ready to Grow Your Business?
					</h2>
					<p className='text-xl text-blue-100 mb-8'>
						Join thousands of businesses that have already taken the
						next step with our financing solutions.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button
							size='lg'
							className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg'>
							Start Application
						</Button>
						<Button
							size='lg'
							variant='outline'
							className='border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg'>
							Contact Sales
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-gray-900 text-white py-12 px-4'>
				<div className='mx-auto max-w-6xl'>
					<div className='grid md:grid-cols-4 gap-8'>
						<div>
							<h3 className='text-lg font-semibold mb-4'>
								Leads Master
							</h3>
							<p className='text-gray-400'>
								Empowering businesses with smart financing
								solutions.
							</p>
						</div>
						<div>
							<h4 className='font-semibold mb-4'>Products</h4>
							<ul className='space-y-2 text-gray-400'>
								<li>Business Loans</li>
								<li>Working Capital</li>
								<li>Equipment Financing</li>
								<li>Invoice Factoring</li>
							</ul>
						</div>
						<div>
							<h4 className='font-semibold mb-4'>Company</h4>
							<ul className='space-y-2 text-gray-400'>
								<li>About Us</li>
								<li>Careers</li>
								<li>Press</li>
								<li>Contact</li>
							</ul>
						</div>
						<div>
							<h4 className='font-semibold mb-4'>Support</h4>
							<ul className='space-y-2 text-gray-400'>
								<li>Help Center</li>
								<li>Documentation</li>
								<li>Privacy Policy</li>
								<li>Terms of Service</li>
							</ul>
						</div>
					</div>
					<div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
						<p>&copy; 2024 Leads Master. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</main>
	);
}
