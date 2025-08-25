import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadDetails } from "@/components/dashboard/lead-details"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch lead details
  const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", id).single()

  if (leadError || !lead) {
    redirect("/dashboard")
  }

  // Fetch team members for assignment
  const { data: profiles } = await supabase.from("profiles").select("id, full_name")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <LeadDetails lead={lead} profiles={profiles || []} />
      </main>
    </div>
  )
}
