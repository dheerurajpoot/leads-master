"use client";

import * as XLSX from "xlsx";
import type { Lead } from "@/components/admin-leads-table";

export function exportLeadsToXLSX(leads: Lead[]) {
	const rows = leads.map((l) => ({
		Name: l.name,
		Phone: l.phone,
		Email: l.email,
		City: l.city || "",
		LoanAmount: l.loanAmount ? `₹${l.loanAmount.toLocaleString()}` : "",
		Status: l.done ? "Completed" : "Pending",
		CreatedAt: new Date(l.created_at).toISOString(),
	}));
	const ws = XLSX.utils.json_to_sheet(rows);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Leads");
	XLSX.writeFile(wb, "leads.xlsx");
}
