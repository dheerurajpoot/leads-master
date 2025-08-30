"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const domain = process.env.NEXT_PUBLIC_SITE_URL;
export default function EmbedCodePage() {
	const [width, setWidth] = useState("500");
	const [height, setHeight] = useState("600");

	const iframeCode = `<iframe 
  src="${domain}/embed" 
  width="${width}px" 
  height="${height}px" 
  frameborder="0" 
  scrolling="no"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
</iframe>`;

	const widgetCode = `<div id="leads-master-container"></div>
<script src="${domain}/widget.js"></script>`;

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	};

	return (
		<main className='min-h-screen bg-gray-50 py-12 px-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Embed Your Lead Form
					</h1>
					<p className='text-xl text-gray-600'>
						Copy and paste these codes into your website to embed
						the lead form
					</p>
				</div>

				<div className='grid md:grid-cols-2 gap-8'>
					{/* Iframe Method */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<span>📱</span>
								Iframe Embed (Recommended)
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='width'>Width (px):</Label>
									<Input
										id='width'
										value={width}
										onChange={(e) =>
											setWidth(e.target.value)
										}
										type='number'
										className='mt-1'
									/>
								</div>
								<div>
									<Label htmlFor='height'>Height (px):</Label>
									<Input
										id='height'
										value={height}
										onChange={(e) =>
											setHeight(e.target.value)
										}
										type='number'
										className='mt-1'
									/>
								</div>
							</div>

							<div className='bg-gray-100 p-4 rounded-lg'>
								<pre className='text-sm text-gray-800 whitespace-pre-wrap'>
									{iframeCode}
								</pre>
							</div>

							<Button
								onClick={() => copyToClipboard(iframeCode)}
								className='w-full'>
								Copy Iframe Code
							</Button>

							<div className='text-sm text-gray-600'>
								<p>
									<strong>Pros:</strong>
								</p>
								<ul className='list-disc list-inside space-y-1 mt-2'>
									<li>Easy to implement</li>
									<li>Responsive design</li>
									<li>No JavaScript conflicts</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					{/* Widget Method */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<span>⚡</span>
								JavaScript Widget
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='bg-gray-100 p-4 rounded-lg'>
								<pre className='text-sm text-gray-800 whitespace-pre-wrap'>
									{widgetCode}
								</pre>
							</div>

							<Button
								onClick={() => copyToClipboard(widgetCode)}
								className='w-full'
								variant='outline'>
								Copy Widget Code
							</Button>

							<div className='text-sm text-gray-600'>
								<p>
									<strong>Pros:</strong>
								</p>
								<ul className='list-disc list-inside space-y-1 mt-2'>
									<li>More customization options</li>
									<li>Better integration with your site</li>
									<li>Can modify styling</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Usage Instructions */}
				<Card className='mt-8'>
					<CardHeader>
						<CardTitle>📋 How to Use</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid md:grid-cols-3 gap-6'>
							<div>
								<h4 className='font-semibold text-lg mb-2'>
									1. WordPress
								</h4>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>• Add HTML block in Gutenberg</li>
									<li>• Paste the iframe code</li>
									<li>• Or use Custom HTML widget</li>
								</ul>
							</div>

							<div>
								<h4 className='font-semibold text-lg mb-2'>
									2. HTML Websites
								</h4>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>
										• Paste code where you want the form
									</li>
									<li>• Adjust width/height as needed</li>
									<li>• Test on different screen sizes</li>
								</ul>
							</div>

							<div>
								<h4 className='font-semibold text-lg mb-2'>
									3. Other Platforms
								</h4>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>• Shopify: Use HTML section</li>
									<li>• Wix: Add HTML embed</li>
									<li>• Squarespace: Code block</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Preview */}
				<Card className='mt-8'>
					<CardHeader>
						<CardTitle>👀 Live Preview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
							<iframe
								src='/embed'
								width={width}
								height={height}
								frameBorder='0'
								scrolling='no'
								style={{
									border: "none",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
									margin: "0 auto",
									display: "block",
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
