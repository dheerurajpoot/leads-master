"use client";

import { useMemo, useState, useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Check, CheckCircle, Trash } from "lucide-react";
import { leadAPI } from "@/lib/api";

export type Lead = {
	id: string;
	name: string;
	email: string;
	phone: string;
	city: string | null;
	loanAmount: number | null;
	done: boolean;
	created_at: string;
};

type DateFilter = "today" | "yesterday" | "last7days" | "last30days" | "all";

interface AdminLeadsTableProps {
	leads: Lead[];
	onLeadUpdate: (updatedLead: Lead) => void;
	onDateFilterChange: (newFilter: DateFilter) => void;
	currentDateFilter: DateFilter;
	onLeadDelete: (leadId: string) => void;
}

export default function AdminLeadsTable({
	leads,
	onLeadUpdate,
	onDateFilterChange,
	currentDateFilter,
	onLeadDelete,
}: AdminLeadsTableProps) {
	const [query, setQuery] = useState("");
	const [dateFilter, setDateFilter] = useState<DateFilter>(currentDateFilter);
	const [updatingLeads, setUpdatingLeads] = useState<Set<string>>(new Set());
	const [deletingLeads, setDeletingLeads] = useState<Set<string>>(new Set());

	// Sync local date filter with parent component
	useEffect(() => {
		setDateFilter(currentDateFilter);
	}, [currentDateFilter]);

	const filtered = useMemo(() => {
		let filteredLeads = leads;

		// Apply date filter
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const last7Days = new Date(today);
		last7Days.setDate(last7Days.getDate() - 7);
		const last30Days = new Date(today);
		last30Days.setDate(last30Days.getDate() - 30);

		switch (dateFilter) {
			case "today":
				filteredLeads = leads.filter((lead) => {
					const leadDate = new Date(lead.created_at);
					return leadDate >= today;
				});
				break;
			case "yesterday":
				filteredLeads = leads.filter((lead) => {
					const leadDate = new Date(lead.created_at);
					return leadDate >= yesterday && leadDate < today;
				});
				break;
			case "last7days":
				filteredLeads = leads.filter((lead) => {
					const leadDate = new Date(lead.created_at);
					return leadDate >= last7Days;
				});
				break;
			case "last30days":
				filteredLeads = leads.filter((lead) => {
					const leadDate = new Date(lead.created_at);
					return leadDate >= last30Days;
				});
				break;
			case "all":
				filteredLeads = leads;
				break;
		}

		// Apply search filter
		const q = query.toLowerCase().trim();
		if (!q) return filteredLeads;

		return filteredLeads.filter(
			(l) =>
				l.name.toLowerCase().includes(q) ||
				l.email.toLowerCase().includes(q) ||
				l.phone.toLowerCase().includes(q) ||
				(l.city || "").toLowerCase().includes(q) ||
				String(l.loanAmount ?? "")
					.toLowerCase()
					.includes(q)
		);
	}, [leads, query, dateFilter]);

	const copyText = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};

	const toggleDone = async (leadId: string, currentDone: boolean) => {
		if (updatingLeads.has(leadId)) return;

		setUpdatingLeads((prev) => new Set(prev).add(leadId));

		try {
			const response = await leadAPI.toggleDone(leadId, !currentDone);
			if (response.ok && response.lead) {
				// Update the lead in the parent component
				onLeadUpdate(response.lead);
			}
		} catch (error) {
			console.error("Failed to toggle done status:", error);
		} finally {
			setUpdatingLeads((prev) => {
				const newSet = new Set(prev);
				newSet.delete(leadId);
				return newSet;
			});
		}
	};

	const deleteLead = async (leadId: string) => {
		if (deletingLeads.has(leadId)) return;
		const confirmed = window.confirm(
			"Are you sure you want to delete this lead? This action cannot be undone."
		);
		if (!confirmed) return;
		setDeletingLeads((prev) => new Set(prev).add(leadId));
		try {
			const response = await leadAPI.delete(leadId);
			if (response.ok) {
				onLeadDelete(leadId);
			}
		} catch (error) {
			console.error("Failed to delete lead:", error);
		} finally {
			setDeletingLeads((prev) => {
				const newSet = new Set(prev);
				newSet.delete(leadId);
				return newSet;
			});
		}
	};

	const handleDateFilterChange = (newFilter: DateFilter) => {
		setDateFilter(newFilter);
		onDateFilterChange(newFilter);
	};

	const getDateFilterLabel = (filter: DateFilter) => {
		switch (filter) {
			case "today":
				return "Today";
			case "yesterday":
				return "Yesterday";
			case "last7days":
				return "Last 7 Days";
			case "last30days":
				return "Last 30 Days";
			case "all":
				return "All Time";
			default:
				return "Today";
		}
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-row gap-4 items-start sm:items-center'>
				<div className='flex-1'>
					<Input
						placeholder='Search leads…'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className='max-w-full'
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Select
						value={dateFilter}
						onValueChange={handleDateFilterChange}>
						<SelectTrigger className='w-40'>
							<SelectValue placeholder='Select date' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='today'>Today</SelectItem>
							<SelectItem value='yesterday'>Yesterday</SelectItem>
							<SelectItem value='last7days'>
								Last 7 Days
							</SelectItem>
							<SelectItem value='last30days'>
								Last 30 Days
							</SelectItem>
							<SelectItem value='all'>All Time</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Results summary */}
			<div className='flex items-center justify-between text-sm text-gray-600'>
				<span>
					Showing {getDateFilterLabel(dateFilter)}: {filtered.length}{" "}
					leads
				</span>
				<span className='text-blue-600 font-medium'>
					{getDateFilterLabel(dateFilter)}
				</span>
			</div>

			{/* Mobile cards */}
			<div className='grid gap-3 md:hidden'>
				{filtered.map((l) => (
					<div
						key={l.id}
						className={`rounded-md border p-3 transition-colors ${
							l.done
								? "border-green-500 bg-green-200"
								: "border-gray-200"
						}`}>
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
								Copy Data
							</Button>
							<Button
								size='sm'
								variant={l.done ? "default" : "outline"}
								onClick={() => toggleDone(l.id, l.done)}
								disabled={updatingLeads.has(l.id)}
								className={`cursor-pointer ${
									l.done
										? "bg-green-600 hover:bg-green-700 text-white"
										: ""
								}`}>
								{updatingLeads.has(l.id) ? (
									<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
								) : l.done ? (
									<CheckCircle className='h-4 w-4' />
								) : (
									<Check className='h-4 w-4' />
								)}
							</Button>
							<Button
								size='sm'
								variant='destructive'
								onClick={() => deleteLead(l.id)}
								disabled={deletingLeads.has(l.id)}
								className='cursor-pointer'>
								{deletingLeads.has(l.id) ? (
									<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
								) : (
									<Trash className='h-4 w-4' />
								)}
							</Button>
						</div>
					</div>
				))}
				{filtered.length === 0 && (
					<div className='text-center text-gray-600'>
						<div className='text-center text-gray-600'>
							No leads found for{" "}
							{getDateFilterLabel(dateFilter).toLowerCase()}.
						</div>
					</div>
				)}
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
							<TableHead className='w-[180px]'>Date</TableHead>
							<TableHead className='w-[200px]'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((l) => (
							<TableRow
								key={l.id}
								className={l.done ? "bg-green-100" : ""}>
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
										<Button
											size='sm'
											variant={
												l.done ? "default" : "outline"
											}
											onClick={() =>
												toggleDone(l.id, l.done)
											}
											disabled={updatingLeads.has(l.id)}
											className={`cursor-pointer ${
												l.done
													? "bg-green-600 hover:bg-green-700 text-white"
													: ""
											}`}>
											{updatingLeads.has(l.id) ? (
												<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
											) : l.done ? (
												<CheckCircle className='h-4 w-4' />
											) : (
												<Check className='h-4 w-4' />
											)}
										</Button>
										<Button
											size='sm'
											variant='destructive'
											onClick={() => deleteLead(l.id)}
											disabled={deletingLeads.has(l.id)}
											className='cursor-pointer'>
											{deletingLeads.has(l.id) ? (
												<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
											) : (
												<Trash className='h-4 w-4' />
											)}
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{filtered.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className='text-center text-gray-600'>
									No leads found for{" "}
									{getDateFilterLabel(
										dateFilter
									).toLowerCase()}
									.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
