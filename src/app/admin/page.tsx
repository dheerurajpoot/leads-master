"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import AdminLeadsTable, { type Lead } from "@/components/admin-leads-table";
import { exportLeadsToXLSX } from "@/lib/export-xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { leadAPI } from "@/lib/api";
import { Shield, Users, CheckCircle, Trash2 } from "lucide-react";

export default function AdminPage() {
	const [adminKey, setAdminKey] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [leads, setLeads] = useState<Lead[]>([]);
	const [currentDateFilter, setCurrentDateFilter] = useState<
		"today" | "yesterday" | "last7days" | "last30days" | "all"
	>("today");
	const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
	const [isDeletingAll, setIsDeletingAll] = useState(false);

	// Check if admin key exists on component mount
	useEffect(() => {
		const savedAdminKey = localStorage.getItem("admin-key");
		if (savedAdminKey) {
			setAdminKey(savedAdminKey);
			setIsAuthenticated(true);
		}
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
		if (isAuthenticated && adminKey) {
			fetchLeads();
		}
	}, [isAuthenticated, adminKey, fetchLeads]);

	const handleLeadUpdate = useCallback((updatedLead: Lead) => {
		setLeads((prevLeads) =>
			prevLeads.map((lead) =>
				lead.id === updatedLead.id ? updatedLead : lead
			)
		);
	}, []);

	const handleLeadDelete = useCallback((leadId: string) => {
		setLeads((prevLeads) => prevLeads.filter((l) => l.id !== leadId));
	}, []);

	// Get filtered leads based on current date filter
	const getFilteredLeads = useCallback(
		(dateFilter: typeof currentDateFilter) => {
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
					return leads.filter((lead) => {
						const leadDate = new Date(lead.created_at);
						return leadDate >= today;
					});
				case "yesterday":
					return leads.filter((lead) => {
						const leadDate = new Date(lead.created_at);
						return leadDate >= yesterday && leadDate < today;
					});
				case "last7days":
					return leads.filter((lead) => {
						const leadDate = new Date(lead.created_at);
						return leadDate >= last7Days;
					});
				case "last30days":
					return leads.filter((lead) => {
						const leadDate = new Date(lead.created_at);
						return leadDate >= last30Days;
					});
				case "all":
					return leads;
				default:
					return leads;
			}
		},
		[leads]
	);

	const handleDateFilterChange = useCallback(
		(newFilter: typeof currentDateFilter) => {
			setCurrentDateFilter(newFilter);
		},
		[]
	);

	const getDateFilterLabel = (filter: typeof currentDateFilter) => {
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

	const authenticateAdmin = async () => {
		if (!adminKey.trim()) {
			setError("Please enter an admin key");
			return;
		}
		setIsLoading(true);
		setError(null);

		try {
			localStorage.setItem("admin-key", adminKey);
			await leadAPI.getAll();
			setIsAuthenticated(true);
		} catch (err: unknown) {
			console.log(err);
			setError("Invalid admin key");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("admin-key");
		setIsAuthenticated(false);
		setAdminKey("");
		setLeads([]);
		setError(null);
	};

	const handleExportFiltered = () => {
		const filteredLeads = getFilteredLeads(currentDateFilter);
		if (filteredLeads.length > 0) {
			exportLeadsToXLSX(filteredLeads);
		}
	};

	const handleDeleteAll = async () => {
		if (!leads.length) return;

		setIsDeletingAll(true);
		setError(null);

		try {
			const result = await leadAPI.deleteAll();
			setLeads([]);
			setShowDeleteAllConfirm(false);
			console.log(`Successfully deleted ${result.deletedCount} leads`);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: (err as { response?: { data?: { error?: string } } })
							?.response?.data?.error ||
					  "Failed to delete all leads";
			setError(errorMessage);
		} finally {
			setIsDeletingAll(false);
		}
	};

	const filteredLeadsCount = getFilteredLeads(currentDateFilter).length;

	// Show authentication form if not authenticated
	if (!isAuthenticated) {
		return (
			<main className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center'>
						<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Shield className='h-8 w-8 text-blue-600' />
						</div>
						<CardTitle className='text-2xl'>Admin Access</CardTitle>
						<p className='text-gray-600 text-sm'>
							Enter your admin key to access the leads dashboard
						</p>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label
								htmlFor='adminKey'
								className='text-sm font-medium text-gray-700'>
								Admin Key
							</label>
							<Input
								id='adminKey'
								placeholder='Enter your admin key'
								value={adminKey}
								onChange={(e) => setAdminKey(e.target.value)}
								type='password'
								className='mt-1'
								onKeyPress={(e) =>
									e.key === "Enter" && authenticateAdmin()
								}
							/>
						</div>

						{error && (
							<p className='text-sm text-red-600 text-center'>
								{error}
							</p>
						)}

						<Button
							onClick={authenticateAdmin}
							disabled={isLoading || !adminKey.trim()}
							className='w-full bg-blue-600 hover:bg-blue-700'>
							{isLoading
								? "Authenticating..."
								: "Access Dashboard"}
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	// Show leads dashboard if authenticated
	return (
		<main className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-6'>
						<div className='flex items-center'>
							<div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
								<Users className='h-5 w-5 text-blue-600' />
							</div>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									Admin Panal
								</h1>
							</div>
						</div>
						<div className='flex flex-col md:flex-row gap-2 items-center space-x-4'>
							<span className='text-sm text-gray-500'>
								<CheckCircle className='inline h-4 w-4 text-green-500 mr-1' />
								Authenticated
							</span>
							<Button
								onClick={logout}
								variant='outline'
								size='sm'
								className='text-red-600 hover:text-red-700 hover:bg-red-50'>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<Card>
					<CardHeader>
						<CardTitle className='text-xl'>
							Leads Management
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Action Buttons */}
						<div className='flex flex-wrap items-center gap-3'>
							<Button
								variant='outline'
								onClick={() => {
									navigator.clipboard.writeText(allEmails);
								}}
								disabled={!leads.length}
								size='sm'>
								Copy all emails
							</Button>
							<Button
								variant='outline'
								onClick={() => {
									navigator.clipboard.writeText(allRows);
								}}
								disabled={!leads.length}
								size='sm'>
								Copy all rows
							</Button>
							<Button
								onClick={handleExportFiltered}
								className='bg-blue-600 hover:bg-blue-700 text-white'
								disabled={!filteredLeadsCount}
								size='sm'>
								Download Excel (
								{getDateFilterLabel(currentDateFilter)})
							</Button>
							<Button
								onClick={() =>
									leads && exportLeadsToXLSX(leads)
								}
								variant='outline'
								disabled={!leads.length}
								size='sm'>
								Download All Leads
							</Button>
							<Button
								variant='secondary'
								onClick={fetchLeads}
								disabled={!adminKey}
								size='sm'>
								Refresh
							</Button>
							<Button
								variant='destructive'
								onClick={() => setShowDeleteAllConfirm(true)}
								disabled={!leads.length || isDeletingAll}
								size='sm'
								className='bg-red-600 hover:bg-red-700 text-white'>
								<Trash2 className='h-4 w-4 mr-1' />
								{isDeletingAll ? "Deleting..." : "Delete All"}
							</Button>
						</div>

						{/* Status Messages */}
						{isLoading && (
							<p className='text-sm text-gray-600'>
								Loading leads…
							</p>
						)}
						{error && (
							<p className='text-sm text-red-600'>
								{error}. Please check your admin key or try
								refreshing.
							</p>
						)}

						{/* Leads Table */}
						{leads.length > 0 && (
							<AdminLeadsTable
								leads={leads}
								onLeadUpdate={handleLeadUpdate}
								onDateFilterChange={handleDateFilterChange}
								currentDateFilter={currentDateFilter}
								onLeadDelete={handleLeadDelete}
							/>
						)}

						{/* Empty State */}
						{!isLoading && !error && leads.length === 0 && (
							<div className='text-center py-12'>
								<Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									No leads yet
								</h3>
								<p className='text-gray-500'>
									Leads will appear here once they start
									coming in.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Delete All Confirmation Dialog */}
			{showDeleteAllConfirm && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<Card className='w-full max-w-md mx-4'>
						<CardHeader>
							<CardTitle className='text-red-600 flex items-center'>
								<Trash2 className='h-5 w-5 mr-2' />
								Delete All Leads
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<p className='text-gray-600'>
								Are you sure you want to delete all{" "}
								{leads.length} leads? This action cannot be
								undone.
							</p>
							<div className='flex gap-3 justify-end'>
								<Button
									variant='outline'
									onClick={() =>
										setShowDeleteAllConfirm(false)
									}
									disabled={isDeletingAll}>
									Cancel
								</Button>
								<Button
									variant='destructive'
									onClick={handleDeleteAll}
									disabled={isDeletingAll}
									className='bg-red-600 hover:bg-red-700'>
									{isDeletingAll
										? "Deleting..."
										: "Delete All"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</main>
	);
}
