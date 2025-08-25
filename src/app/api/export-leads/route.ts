import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all leads
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select(`
        *,
        profiles:assigned_to(full_name)
      `)
      .order("created_at", { ascending: false })

    if (leadsError) {
      console.error("Error fetching leads:", leadsError)
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
    }

    // Convert to CSV format
    const csvHeaders = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Message",
      "Status",
      "Assigned To",
      "Created Date",
      "Last Updated",
    ]

    const csvRows =
      leads?.map((lead) => [
        lead.name || "",
        lead.email || "",
        lead.phone || "",
        lead.company || "",
        (lead.message || "").replace(/"/g, '""'), // Escape quotes in message
        lead.status || "",
        lead.profiles?.full_name || "Unassigned",
        new Date(lead.created_at).toLocaleDateString("en-US"),
        new Date(lead.updated_at).toLocaleDateString("en-US"),
      ]) || []

    // Create CSV content
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row
          .map((field) =>
            typeof field === "string" && (field.includes(",") || field.includes('"') || field.includes("\n"))
              ? `"${field}"`
              : field,
          )
          .join(","),
      ),
    ].join("\n")

    // Create response with CSV data
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="leadmaster-leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })

    return response
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
