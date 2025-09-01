import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Disclaimer() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<Card className='border border-gray-200'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold text-gray-900'>
						Disclaimer
					</CardTitle>
					<p className='text-sm text-gray-600'>
						Last updated: Sep-2025
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							1. General Information
						</h2>
						<p className='text-gray-700'>
							The information provided on this website is for
							general informational purposes only. While we strive
							to keep the information up to date and correct, we
							make no representations or warranties of any kind,
							express or implied, about the completeness,
							accuracy, reliability, suitability, or availability
							of the information, products, services, or related
							graphics contained on the website for any purpose.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							2. Loan Application Disclaimer
						</h2>
						<p className='text-gray-700 mb-2'>
							Important information about loan applications:
						</p>
						<ul className='list-disc list-inside text-gray-700 space-y-1 ml-4'>
							<li>
								Submission of an application does not guarantee
								loan approval
							</li>
							<li>
								All applications are subject to credit review
								and approval
							</li>
							<li>
								Loan terms and conditions are subject to change
							</li>
							<li>
								Interest rates and fees may vary based on
								creditworthiness
							</li>
							<li>Additional documentation may be required</li>
						</ul>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							3. No Financial Advice
						</h2>
						<p className='text-gray-700'>
							The information on this website does not constitute
							financial advice, investment advice, trading advice,
							or any other sort of advice. You should not treat
							any of the website&apos;s content as such. We
							recommend consulting with qualified financial
							professionals before making any financial decisions.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							4. Third-Party Links
						</h2>
						<p className='text-gray-700'>
							This website may contain links to third-party
							websites. We have no control over the nature,
							content, and availability of those sites. The
							inclusion of any links does not necessarily imply a
							recommendation or endorse the views expressed within
							them.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							5. Limitation of Liability
						</h2>
						<p className='text-gray-700'>
							In no event shall we be liable for any loss or
							damage including without limitation, indirect or
							consequential loss or damage, arising from loss of
							data or profits arising out of, or in connection
							with, the use of this website.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							6. Regulatory Compliance
						</h2>
						<p className='text-gray-700'>
							Our services are subject to applicable laws and
							regulations. We reserve the right to modify or
							discontinue services to comply with regulatory
							requirements. Users are responsible for ensuring
							their use of our services complies with local laws
							and regulations.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							7. Data and Privacy
						</h2>
						<p className='text-gray-700'>
							While we implement security measures to protect your
							information, no method of transmission over the
							internet is 100% secure. We cannot guarantee the
							absolute security of your data. Please review our
							Privacy Policy for detailed information about data
							handling.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							8. Changes to Terms
						</h2>
						<p className='text-gray-700'>
							We reserve the right to modify this disclaimer at
							any time. Changes will be effective immediately upon
							posting on the website. Your continued use of the
							website after any changes constitutes acceptance of
							the new terms.
						</p>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-gray-900 mb-3'>
							9. Contact Information
						</h2>
						<p className='text-gray-700'>
							If you have any questions about this disclaimer,
							please contact us:
						</p>
						<div className='mt-2 text-gray-700'>
							<p>Email: contact@evtn.org</p>
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
