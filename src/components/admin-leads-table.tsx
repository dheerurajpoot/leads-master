"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type Lead = {
	id: string;
	name: string;
	email: string;
	phone: string;
	city: string | null;
	loanAmount: number | null;
	source: string;
	created_at: string;
};

export default function AdminLeadsTable({ leads }: { leads: Lead[] }) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return leads;
		return leads.filter(
			(l) =>
				l.name.toLowerCase().includes(q) ||
				l.email.toLowerCase().includes(q) ||
				l.phone.toLowerCase().includes(q) ||
				(l.city || "").toLowerCase().includes(q) ||
				String(l.loanAmount ?? "")
					.toLowerCase()
					.includes(q) ||
				l.source.toLowerCase().includes(q)
		);
	}, [leads, query]);

	const copyText = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center gap-2'>
				<Input
					placeholder='Search leads…'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className='max-w-full'
				/>
			</div>

			{/* Mobile cards */}
			<div className='grid gap-3 md:hidden'>
				{filtered.map((l) => (
					<div
						key={l.id}
						className='rounded-md border border-gray-200 p-3'>
						<div className='flex items-center justify-between'>
							<div className='font-medium'>{l.name}</div>
							<div className='text-xs text-gray-600'>
								{new Date(l.created_at).toLocaleString()}
							</div>
						</div>
						<div className='mt-1 text-sm'>
							<div className='text-blue-600'>{l.email}</div>
							<div className='text-gray-900'>{l.phone}</div>
							{l.city && (
								<div className='text-gray-600'>{l.city}</div>
							)}
							{l.loanAmount !== null && (
								<div className='mt-1 text-gray-900'>
									Loan: ₹{l.loanAmount.toLocaleString()}
								</div>
							)}
							<div className='mt-1 text-xs text-gray-500'>
								Source: {l.source}
							</div>
						</div>
						<div className='mt-2 flex gap-2'>
							<Button
								size='sm'
								variant='outline'
								onClick={() => copyText(l.phone)}
								className='cursor-pointer'>
								Copy Phone
							</Button>
							<Button
								className='cursor-pointer'
								size='sm'
								variant='secondary'
								onClick={() =>
									copyText(
										`${l.name}, ${l.email}, ${l.phone}, ${
											l.city || ""
										}, ${l.loanAmount ?? ""}`
									)
								}>
								Copy row
							</Button>
						</div>
					</div>
				))}
			</div>

			{/* Desktop table */}
			<div className='hidden md:block'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[160px]'>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>City</TableHead>
							<TableHead>Loan Amount</TableHead>
							<TableHead>Source</TableHead>
							<TableHead className='w-[180px]'>Date</TableHead>
							<TableHead className='w-[160px]'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((l) => (
							<TableRow key={l.id}>
								<TableCell className='font-medium'>
									{l.name}
								</TableCell>
								<TableCell className='text-blue-600'>
									{l.email}
								</TableCell>
								<TableCell>{l.phone}</TableCell>
								<TableCell>{l.city}</TableCell>
								<TableCell>
									{l.loanAmount
										? `₹${l.loanAmount.toLocaleString()}`
										: ""}
								</TableCell>
								<TableCell className='text-gray-600'>
									{l.source}
								</TableCell>
								<TableCell>
									{new Date(l.created_at).toLocaleString()}
								</TableCell>
								<TableCell>
									<div className='flex gap-2'>
										<Button
											size='sm'
											className='cursor-pointer'
											variant='outline'
											onClick={() =>
												navigator.clipboard.writeText(
													l.phone
												)
											}>
											Copy Phone
										</Button>
										<Button
											size='sm'
											className='cursor-pointer'
											variant='secondary'
											onClick={() =>
												navigator.clipboard.writeText(
													`${l.name}, ${l.email}, ${
														l.phone
													}, ${l.city || ""}, ${
														l.loanAmount ?? ""
													}`
												)
											}>
											Copy row
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{filtered.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={8}
									className='text-center text-gray-600'>
									No leads found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
