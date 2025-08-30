"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { leadAPI } from "@/lib/api";
import { CheckCircle } from "lucide-react";

type Status = {
	type: "idle" | "loading" | "success" | "error";
	message?: string;
};

export default function LeadForm({ source = "landing" }: { source?: string }) {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [city, setCity] = useState("");
	const [loanAmount, setLoanAmount] = useState<string>("");
	const [website, setWebsite] = useState(""); // honeypot
	const [status, setStatus] = useState<Status>({ type: "idle" });

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ type: "loading" });

		try {
			await leadAPI.create({
				name,
				phone,
				email,
				city,
				loanAmount: loanAmount === "" ? undefined : Number(loanAmount),
				source,
			});

			setStatus({
				type: "success",
				message: "Thanks! We'll be in touch soon.",
			});

			// Reset form
			setName("");
			setPhone("");
			setEmail("");
			setCity("");
			setLoanAmount("");
			setWebsite("");
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: (err as { response?: { data?: { error?: string } } })
							?.response?.data?.error || "Failed to submit";
			setStatus({ type: "error", message: errorMessage });
		}
	};

	const resetForm = () => {
		setStatus({ type: "idle" });
	};

	// Show success state instead of form
	if (status.type === "success") {
		return (
			<Card className='border border-gray-200'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center gap-4 py-8'>
						<CheckCircle className='h-16 w-16 text-emerald-500' />
						<h3 className='text-xl font-semibold text-gray-900'>
							Your application has been received!
						</h3>
						<p className='text-gray-600 max-w-md'>
							We will contact you shortly.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='border border-gray-200'>
			<CardHeader>
				<CardTitle className='text-pretty'>
					Apply for a Business loan
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className='flex flex-col gap-4'>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='name'>Full name</Label>
						<Input
							id='name'
							name='name'
							placeholder='Enter your name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							aria-required='true'
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='phone'>Phone</Label>
						<Input
							id='phone'
							name='phone'
							type='tel'
							inputMode='tel'
							placeholder='Enter your phone number'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
							aria-required='true'
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='Enter your email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							aria-required='true'
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='city'>City</Label>
						<Input
							id='city'
							name='city'
							placeholder='Enter your city'
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='loanAmount'>Loan Amount</Label>
						<Input
							id='loanAmount'
							name='loanAmount'
							type='number'
							inputMode='numeric'
							placeholder='Enter loan amount'
							value={loanAmount}
							onChange={(e) => setLoanAmount(e.target.value)}
							min='0'
							step='1'
						/>
					</div>

					{/* Honeypot field for bots (hidden from users) */}
					<div className='sr-only' aria-hidden='true'>
						<Label htmlFor='website'>Website</Label>
						<Input
							id='website'
							name='website'
							tabIndex={-1}
							autoComplete='off'
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
						/>
					</div>

					<Button
						type='submit'
						className='bg-blue-600 hover:bg-blue-700 text-white'
						disabled={status.type === "loading"}>
						{status.type === "loading" ? "Submitting..." : "Submit"}
					</Button>

					{status.type === "error" && (
						<p className='text-sm text-red-600'>{status.message}</p>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
