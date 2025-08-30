"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import AdminLeadsTable, { type Lead } from "@/components/admin-leads-table";
import { exportLeadsToXLSX } from "@/lib/export-xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { leadAPI } from "@/lib/api";

export default function AdminPage() {
	const [adminKey, setAdminKey] = useState("");
	const [saved, setSaved] = useState(false);
	const [leads, setLeads] = useState<Lead[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const k = localStorage.getItem("admin-key");
		if (k) setAdminKey(k);
	}, []);

	const fetchLeads = useCallback(async () => {
		if (!adminKey) return;

		setIsLoading(true);
		setError(null);

		try {
			const data = await leadAPI.getAll();
			setLeads(data.leads || []);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: (err as { response?: { data?: { error?: string } } })
							?.response?.data?.error || "Failed to fetch leads";
			setError(errorMessage);
			setLeads([]);
		} finally {
			setIsLoading(false);
		}
	}, [adminKey]);

	useEffect(() => {
		if (adminKey) {
			fetchLeads();
		}
	}, [adminKey, fetchLeads]);

	const allEmails = useMemo(
		() => leads.map((l) => l.email).join("\n"),
		[leads]
	);
	const allRows = useMemo(
		() =>
			leads
				.map(
					(l) =>
						`${l.name}, ${l.email}, ${l.phone}, ${l.city || ""}, ${
							l.loanAmount ?? ""
						}`
				)
				.join("\n"),
		[leads]
	);

	const saveKey = () => {
		localStorage.setItem("admin-key", adminKey);
		setSaved(true);
		setTimeout(() => setSaved(false), 1200);
		fetchLeads();
	};

	return (
		<main className='mx-auto max-w-5xl px-4 py-8'>
			<Card>
				<CardHeader>
					<CardTitle className='text-pretty'>Admin • Leads</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='flex flex-col items-start gap-2 md:flex-row md:items-end'>
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='adminkey'
								className='text-sm font-medium'>
								Admin key
							</label>
							<Input
								id='adminkey'
								placeholder='Enter ADMIN_KEY'
								value={adminKey}
								onChange={(e) => setAdminKey(e.target.value)}
								type='password'
								className='w-64'
							/>
						</div>
						<Button
							onClick={saveKey}
							className='bg-blue-600 hover:bg-blue-700 text-white md:ml-2'>
							Save key
						</Button>
						{saved && (
							<span className='text-sm text-emerald-600 md:ml-2'>
								Saved
							</span>
						)}
					</div>

					<div className='flex flex-wrap items-center gap-2'>
						<Button
							variant='outline'
							onClick={() => {
								navigator.clipboard.writeText(allEmails);
							}}
							disabled={!leads.length}>
							Copy all emails
						</Button>
						<Button
							variant='outline'
							onClick={() => {
								navigator.clipboard.writeText(allRows);
							}}
							disabled={!leads.length}>
							Copy all rows
						</Button>
						<Button
							onClick={() => leads && exportLeadsToXLSX(leads)}
							className='bg-blue-600 hover:bg-blue-700 text-white'
							disabled={!leads.length}>
							Download Excel
						</Button>
						<Button
							variant='secondary'
							onClick={fetchLeads}
							disabled={!adminKey}>
							Refresh
						</Button>
					</div>

					{isLoading && (
						<p className='text-sm text-gray-600'>Loading leads…</p>
					)}
					{error && (
						<p className='text-sm text-red-600'>
							{error}. Ensure the ADMIN_KEY is set and correct.
						</p>
					)}
					{leads.length > 0 && <AdminLeadsTable leads={leads} />}
				</CardContent>
			</Card>
		</main>
	);
}
