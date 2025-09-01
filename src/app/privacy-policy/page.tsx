import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<Card className='border border-gray-200'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold text-gray-900'>
						Privacy Policy
					</CardTitle>
					<p className='text-sm text-gray-600'>
						Last updated: Sep-2025
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							1. Information We Collect
						</h2>
						<p className='text-gray-700 mb-2'>
							We collect information you provide directly to us,
							including:
						</p>
						<ul className='list-disc list-inside text-gray-700 space-y-1 ml-4'>
							<li>Full name</li>
							<li>Phone number</li>
							<li>Email address</li>
							<li>City of residence</li>
							<li>Loan amount requested</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							2. How We Use Your Information
						</h2>
						<p className='text-gray-700 mb-2'>
							We use the information we collect to:
						</p>
						<ul className='list-disc list-inside text-gray-700 space-y-1 ml-4'>
							<li>Process your loan application</li>
							<li>Contact you regarding your application</li>
							<li>Provide customer support</li>
							<li>
								Send you important updates about your
								application
							</li>
							<li>Comply with legal obligations</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							3. Information Sharing
						</h2>
						<p className='text-gray-700'>
							We do not sell, trade, or otherwise transfer your
							personal information to third parties without your
							consent, except as described in this policy. We may
							share your information with:
						</p>
						<ul className='list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2'>
							<li>Lending partners and financial institutions</li>
							<li>
								Service providers who assist in our operations
							</li>
							<li>Legal authorities when required by law</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							4. Data Security
						</h2>
						<p className='text-gray-700'>
							We implement appropriate security measures to
							protect your personal information against
							unauthorized access, alteration, disclosure, or
							destruction. However, no method of transmission over
							the internet is 100% secure.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							5. Your Rights
						</h2>
						<p className='text-gray-700 mb-2'>
							You have the right to:
						</p>
						<ul className='list-disc list-inside text-gray-700 space-y-1 ml-4'>
							<li>Access your personal information</li>
							<li>Correct inaccurate information</li>
							<li>Request deletion of your information</li>
							<li>Opt-out of marketing communications</li>
							<li>File a complaint with relevant authorities</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							6. Cookies and Tracking
						</h2>
						<p className='text-gray-700'>
							We may use cookies and similar tracking technologies
							to enhance your experience on our website. You can
							control cookie settings through your browser
							preferences.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							7. Changes to This Policy
						</h2>
						<p className='text-gray-700'>
							We may update this privacy policy from time to time.
							We will notify you of any material changes by
							posting the new policy on this page and updating the
							&quot;Last updated&quot; date.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							8. Contact Us
						</h2>
						<p className='text-gray-700'>
							If you have any questions about this privacy policy
							or our data practices, please contact us at:
						</p>
						<div className='mt-2 text-gray-700'>
							<p>Email: contact@evtn.com</p>
							<p>Phone: +917755089819</p>
							<p>Address: Old Shivli Road, Kalyanpur Kanpur</p>
						</div>
					</div>

					<div className='pt-6 border-t border-gray-200'>
						<Link
							href='/'
							className='text-blue-600 hover:underline text-sm'>
							← Back to Home
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
