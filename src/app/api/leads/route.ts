import { connectDb } from "@/lib/database";
import { Lead } from "@/lib/models/lead";
import { NextResponse } from "next/server";

// CORS headers for embeddable form POSTs
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS, PATCH",
	"Access-Control-Allow-Headers": "Content-Type, x-admin-key",
};

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
	// Simple, permissive phone validator for international formats
	return /^\+?[0-9\s().-]{7,}$/.test(phone);
}

export async function OPTIONS() {
	// Preflight response for cross-origin POSTs
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}));
		const { name, phone, email, city = "", loanAmount } = body || {};

		// Basic validation
		if (!name || typeof name !== "string" || name.trim().length < 2) {
			return NextResponse.json(
				{ error: "Name is required and must be at least 2 characters" },
				{ status: 400, headers: corsHeaders }
			);
		}
		if (!email || typeof email !== "string" || !isValidEmail(email)) {
			return NextResponse.json(
				{ error: "Valid email is required" },
				{ status: 400, headers: corsHeaders }
			);
		}
		if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
			return NextResponse.json(
				{ error: "Valid phone is required" },
				{ status: 400, headers: corsHeaders }
			);
		}

		const parsedLoan =
			loanAmount === undefined || loanAmount === null || loanAmount === ""
				? null
				: Number.isFinite(Number(loanAmount))
				? Number(loanAmount)
				: null;

		await connectDb();

		// Create new lead using the model
		const lead = new Lead({
			name: name.trim(),
			email: email.trim().toLowerCase(),
			phone: phone.trim(),
			city: typeof city === "string" ? city.trim() : "",
			loanAmount: parsedLoan,
			done: false,
		});

		await lead.save();

		return NextResponse.json(
			{
				ok: true,
				message: "Lead created successfully",
			},
			{ headers: corsHeaders }
		);
	} catch (err) {
		console.error("POST /api/leads error:", err);

		// Handle duplicate email error
		if (err instanceof Error && err.message.includes("duplicate key")) {
			return NextResponse.json(
				{ error: "A lead with this email already exists" },
				{ status: 409, headers: corsHeaders }
			);
		}

		return NextResponse.json(
			{ error: "Unexpected error occurred" },
			{ status: 500, headers: corsHeaders }
		);
	}
}

export async function PATCH(req: Request) {
	try {
		const adminKey = req.headers.get("x-admin-key");
		const expected = process.env.ADMIN_KEY;

		if (!expected || adminKey !== expected) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json().catch(() => ({}));
		const { leadId, done } = body;

		if (!leadId || typeof done !== "boolean") {
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 }
			);
		}

		await connectDb();

		const lead = await Lead.findByIdAndUpdate(
			leadId,
			{ done },
			{ new: true }
		);

		if (!lead) {
			return NextResponse.json(
				{ error: "Lead not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			ok: true,
			lead: {
				id: String(lead._id),
				name: lead.name,
				email: lead.email,
				phone: lead.phone,
				city: lead.city || "",
				loanAmount: lead.loanAmount ?? null,
				done: lead.done,
				created_at:
					lead.created_at?.toISOString() || new Date().toISOString(),
			},
		});
	} catch (err) {
		console.error("PATCH /api/leads error:", err);
		return NextResponse.json(
			{ error: "Failed to update lead" },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	try {
		const adminKey = req.headers.get("x-admin-key");
		const expected = process.env.ADMIN_KEY;

		if (!expected || adminKey !== expected) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectDb();

		const leads = await Lead.find({})
			.sort({ created_at: -1 })
			.lean()
			.exec();

		const formattedLeads = leads.map((lead) => ({
			id: String(lead._id),
			name: lead.name,
			email: lead.email,
			phone: lead.phone,
			city: lead.city || "",
			loanAmount: lead.loanAmount ?? null,
			done: lead.done,
			created_at:
				lead.created_at?.toISOString() || new Date().toISOString(),
		}));

		return NextResponse.json({ leads: formattedLeads });
	} catch (err) {
		console.error("GET /api/leads error:", err);
		return NextResponse.json(
			{ error: "Failed to fetch leads" },
			{ status: 500 }
		);
	}
}
